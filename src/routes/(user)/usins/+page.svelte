<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte"; 
  import QuestionPerson from '$lib/components/svgs/question-person.svelte';
  import Icon from "@iconify/svelte";
  import seedrandom from 'seedrandom';
  import ExcelJS from "exceljs";
  import { download } from "$lib/components/boquette/ExportImportFeuilleRhopses.js";

  export let data;

  let onscrit_nums = NaN;

  function getFormattedDate(): string {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const seed = getFormattedDate();
  const rng = seedrandom(seed);


  function shuffleArray<T>(array: T[], rng: () => number): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

  const keys = Array.from({ length: 140 }, (_, i) => i + 1);
  const values = shuffleArray( Array.from({ length: 140 }, (_, i) => i + 1), rng)

  const result: { [key: number]: number } = {};
  for (let i = 0; i < keys.length; i++) {
      result[keys[i]] = values[i];
  }

  type InputType = { nums: number, comments: { [key: string]: string } }[];
  type OutputType = { [key: string]: { [key: number]: string } };

  function transform(input: InputType): OutputType {
    const result: OutputType = {};

    input.forEach(item => {
      const { nums, comments } = item;

      // Iterate over each date in the `data` object
      Object.keys(comments).forEach(dateKey => {
        if (!result[dateKey]) {
          result[dateKey] = {};
        }

        result[dateKey][nums] = comments[dateKey];
      });
    });

    return result;
  }

  const exportOnscrits = async()=>{
    const res = await fetch('?/exportOnscrits');
    let data_array = (await res.json()) as InputType;


    const output = transform(data_array);
    console.log(output);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Get unique dates (columns) and nums (rows)
    const dates = Object.keys(output).sort();
    const nums = Array.from(new Set(
      Object.values(output).flatMap(dateObj => Object.keys(dateObj).map(Number))
    )).sort((a, b) => a - b);

    // Add header row: First column is 'Nums', followed by the dates
    worksheet.columns = [
      { header: 'Nums', key: 'nums', width: 10 },
      ...dates.map(date => ({ header: date, key: date, width: 15 }))
    ];

    nums.forEach(num => {
      const rowData: any = { nums: num };

      dates.forEach(date => {
        // Add the value from the transformed data or leave it blank if missing
        const value = output[date] && output[date][num] ? output[date][num]: '';
        rowData[date] = value;
      });

      worksheet.addRow(rowData);
    });


    download(workbook,'suivi_onscrits.xlsx');
  }
</script>

<div class="flex flex-col items-center gap-10">
  <p class="text-white font-zagoth text-6xl">Usin's</p>
  <div class="aspect-square w-full flex flex-col gap-5 items-center justify-items-center ">
    
    
    <div class="w-80">
      <SectionCard title='Ordre du jour'>
        <p>Introduction du mot shymen, début de la période ayat</p>
      </SectionCard>
    </div>

    <div class="flex flex-col gap-4">
        <SectionCard title='.onscrits'>
          <div class="w-24">
            <QuestionPerson/>
          </div>
          <div class="h-40 flex justify-center items-center">
            <div  class="text-4xl flex flex-col items-center">
              <input required type="number" placeholder="nums du .onscrit" class="input p-2 w-80 text-center" bind:value={onscrit_nums} name="nums" min="1" max="150">
              <a href="/usins/onscrits-{onscrit_nums}" class="btn-icon text-4xl">
                <Icon icon="mdi:search"/>
              </a>
            </div>
          </div>
        </SectionCard>
      
      {#if data.BOQUETTES.find(e => e.id_boquette == 23) !== undefined}
          <button on:click={exportOnscrits} class="btn variant-filled-secondary">
            <Icon icon="mdi:export"/>
          </button>
      {/if}
      
      <!-- <a class="" href="/usins/planning">
        <SectionCard title='Planning'>
          <div class="w-24">
            <Planning/>
          </div>
        </SectionCard>
      </a> -->
    </div>
  </div>
</div>