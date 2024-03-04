<script lang="ts">
  import SearchPg from "$lib/components/miscellaneous/SearchPG.svelte";
  import MyButton from "$lib/components/utils/MyButton.svelte";

  export let pgs:{nums:number,proms:number,bucque:string|null}[];
  //const searchTerms = {"Nums":writable([]),"Proms":writable(''),"Bucque":writable('')};
  let filteredResults:{nums:number,proms:number,bucque:string|null}[] = []
</script>

<SearchPg pgs={pgs} tableTitles={['Nums','Bucque','Action']} title="Rhopse" bind:filteredResults={filteredResults}>
  {#each filteredResults as pg}
    <tr class="border-t-1">
      <th>{pg.nums}</th>
      <td>{pg.bucque}</td>
      <td><div class="p-2"><MyButton value="RHOPSER"/></div></td>
    </tr>
  {/each}
</SearchPg>
<!-- 
<SectionCard title="Rhopse">
  <p class="bg-orange-200 text-black rounded-md p-2">Tu peux rechercher par nums + proms ou par bucque. Si le compte n'est plus actif, il s'affichera pas.</p>
  
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
          <th scope="col">Nums</th>
          <th scope="col">Bucque</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
          {#each filteredResults as pg}
          <tr class="border-t-1">
            <th>{pg.nums}</th>
            <td>{pg.bucque}</td>
            <td><div class="p-2"><MyButton value="RHOPSER"/></div></td>
          </tr>
        {/each}
        
        
      </tbody>
    </table>  
  {/if}
</SectionCard> -->