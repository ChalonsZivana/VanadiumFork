<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte"; 
  import QuestionPerson from '$lib/components/svgs/question-person.svelte';
  import Icon from "@iconify/svelte";
  import seedrandom from 'seedrandom';

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
</script>

<div class="flex flex-col items-center gap-10">
  <p class="text-white font-zagoth text-6xl">Usin's</p>
  <div class="aspect-square w-full flex flex-col gap-5 items-center justify-items-center ">
    
    
    <div class="w-80">
      <SectionCard title='Ordre du jour'>
        <p>Introduction du mot shymen, début de la période ayat</p>
      </SectionCard>
    </div>

    <div>
      <SectionCard title='Mon fourchettage'>
        <div class="w-24">
          <Icon icon="mdi:silverware-fork" />          <QuestionPerson/>
        </div>
        
      </SectionCard>
    </div>
    
    <div class="flex gap-4">
      <a href="/usins/onscrits">
        <SectionCard title='.onscrits'>
          <div class="w-24">
            <QuestionPerson/>
          </div>
          
        </SectionCard>
      </a>

      
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