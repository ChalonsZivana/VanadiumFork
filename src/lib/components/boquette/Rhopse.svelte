<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import type { boquettes, pg } from '@prisma/client'
  import Search from "$lib/components/search/Search.svelte";
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte"
  import Special from "$lib/components/miscellaneous/Special.svelte"
  import { createDataToSort } from "$lib/components/search/search.js";

  export let pgs:Partial<pg>[];
  export let boquette:boquettes;

  let searchNums:number|null = null;
  let searchProms:number|null = null;

  const dataToSort = createDataToSort({pgs,boquettes:[],fams:[]});
</script>
  <SectionCard title="Rhopse">
    <div class="flex rounded-md w-full justify-center divide-x-2 divide-red-600">
      <input bind:value={searchNums} class="p-1 outline-none text-black text-xs bg-red-100 w-1/2 placeholder-gray-500" type="number" placeholder="nums">
      <input bind:value={searchProms} class="p-1 outline-none text-black text-xs bg-red-100 w-1/2  placeholder-gray-500" type="number" placeholder="proms">
      <!-- <button on:click={()=>searchText=''} class="bg-red-100"><CloseCircle className="w-10"/></button> -->
    </div>
      <Search
      searchText={""}
      bind:searchNums={searchNums}
      bind:searchProms={searchProms}

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
