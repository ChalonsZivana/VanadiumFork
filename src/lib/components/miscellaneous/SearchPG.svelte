<script lang="ts">
  import SectionCard from "$lib/components/section_card.svelte";

  export let pgs:{nums:number,proms:number,bucque:string|null}[];
  export let tableTitles:string[];
  export let filteredResults:{nums:number,proms:number,bucque:string|null}[] = []
  $: filteredResults = [];

  let [nums,proms,bucque] = ['','','']

  function updateResults () {
    if(nums=="" && proms == "" && proms==""){
      return []
    }
    let result = pgs.filter(e=>e.bucque?.includes(bucque));
    if(nums != ''){
      result = result.filter(e=>nums == e.nums.toString());
    }
    if(proms != ''){
      result = result.filter(e=>proms == e.proms.toString());
    }
    
    filteredResults = result;
  }
  export let title:string;
</script>


<SectionCard title={title}>
  <p class="bg-orange-200 text-black rounded-md p-2">Tu peux rechercher par nums + proms ou par bucque. </p>
  <!-- Si le compte n'est plus actif, il s'affichera pas. -->
  <form on:input={updateResults} class="w-full">
    <div class="flex flex-col">
      <label class="font-zagoth text-white" for="rhopse_Nums">Nums</label>
      <input bind:value={nums}  type="text" id="rhopse_Nums" >
    </div>
    <div class="flex flex-col">
      <label class="font-zagoth text-white" for="rhopse_Proms">Proms</label>
      <input bind:value={proms}  type="text" id="rhopse_Proms" >
    </div>
    <div class="flex flex-col">
      <label class="font-zagoth text-white" for="rhopse_Bucque">Bucque</label>
      <input bind:value={bucque}  type="text" id="rhopse_Bucque" >
    </div>
  </form>
  
  {#if filteredResults.length != 0}
    <table class="text-white">
      <thead>
        <tr>
          {#each tableTitles as t}
            <th scope="col">{t}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
          <slot/>
      </tbody>
    </table>  
  {/if}
</SectionCard>