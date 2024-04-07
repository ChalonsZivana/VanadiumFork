<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import type { boquettes, pg } from '@prisma/client'
  import Search from "$lib/components/search/Search.svelte";
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte"
  import Special from "$lib/components/miscellaneous/Special.svelte"
  import { createDataToSort } from "$lib/components/search/search.js";
  import CloseCircle from "$lib/components/svgs/close-circle.svelte";

  export let pgs:Partial<pg>[];
  export let boquette:boquettes;

  let searchText = "";

  const dataToSort = createDataToSort({pgs,boquettes:[],fams:[]});
</script>

  <SectionCard title="Rhopse">
    <div class="flex rounded-md w-full">
      <input bind:value={searchText} class="text-black p-2 outline-none bg-red-100 w-full placeholder-gray-500" type="text" placeholder="recherche: {"PG"}">
      <button on:click={()=>searchText=''} class="bg-red-100"><CloseCircle className="w-10"/></button>
    </div>
      <Search
      bind:searchText={searchText}
      selected={"PG"}
      dataToSort={dataToSort}>    
    
    
      <svelte:fragment slot="PG" let:sIP>
        <CustomTable title="PG" headers={["Nums", "Bucque", "Profil"]} elements={sIP}>
          <tr slot="tbody" let:e>
            <th class="p-2">
              <Special special={[11,89,111].includes(e.pg.nums??-1)}>
                {e.pg.nums}Ch{e.pg.proms}
              </Special>
            </th>
            <td>{e.pg.bucque}</td>
            <td><a href="/boquette-{boquette.id_boquette}/rhopse-{e.pg.id_pg}" class="bg-gray-500 p-1 text-gray-300 rounded-lg">Rhopse</a></td>
          <tr/>
        </CustomTable>
      </svelte:fragment>
    </Search>
  </SectionCard>
