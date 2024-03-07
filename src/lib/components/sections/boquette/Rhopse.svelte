<script lang="ts"> 
  import SectionCard from "$lib/components/SectionCard.svelte";
  import Search from "$lib/components/search/Search.svelte";
  import { type SelectTypes, createDataToSort } from "$lib/components/search/search";
  import { page } from '$app/stores';  

  export let pgs:{nums:number,proms:number,bucque:string|null, id_pg:number}[];

  const tableHeaders:{[K in SelectTypes]:string[]} = {
    'Tout':[], 
    'PG':['Num','Bucque',''],
    'Fams':['Fams','Historique'],
    'Boquette':['Id','Nom','Action']
  }
  let searchText:string='11';
  const dataToSort = createDataToSort({
      pgs:pgs,
      fams:[],
      boquettes:[]
  });
</script>

<SectionCard title="Rhopse">
  <div class="flex rounded-md overflow-clip w-11/12">

  <input bind:value={searchText} class="p-2 w-full" type="text" placeholder="recherche: PG">
  </div>
  
  <Search 
    bind:searchText={searchText} 
    selected="Tout"
    dataToSort={dataToSort}
    tableHeaders={tableHeaders}>
    <svelte:fragment slot="PG" let:sI>
      <th>{sI.pg.nums}Ch{sI.pg.proms}</th>
      <td>{sI.pg.bucque}</td>
      <td><a href="{$page.url.pathname}/rhopse-{sI.pg.id_pg}" class="bg-gray-500 p-1 text-gray-300 rounded-lg">Rhopse</a></td>
    </svelte:fragment>
  </Search>
</SectionCard>

<!-- <SearchPg pgs={pgs} tableTitles={['Nums','Bucque','Action']} title="Rhopse" bind:filteredResults={filteredResults}>
  {#each filteredResults as pg}
    <tr class="border-t-1">
      <th>{pg.nums}</th>
      <td>{pg.bucque}</td>
      <td><a href="{$page.url.pathname}/rhopse-{pg.id_pg}/" class="p-2"><MyButton value="RHOPSER"/></a></td>
    </tr>
  {/each}
</SearchPg> -->