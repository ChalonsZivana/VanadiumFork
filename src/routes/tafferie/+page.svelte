<script lang="ts">
  import CustomTable from '$lib/components/miscellaneous/CustomTable.svelte';
  import SectionCard from '$lib/components/SectionCard.svelte';
  import MyButton from '$lib/components/miscellaneous/MyButton.svelte';
  import MoneyColor from '$lib/components/miscellaneous/MoneyColor.svelte';
  import Search from '$lib/components/search/Search.svelte';
  import { createDataToSort, type SelectTypes } from "$lib/components/search/search.js";

  export let data;

  
  const tableHeaders:{[K in SelectTypes]:string[]} = {
    'Tout':[], 
    'PG':['Num','Bucque','Solde','Profil'],
    'Fams':['Fams','Solde','Historique'],
    'Boquette':['Id','Nom','Solde','Action']
  }
  let selected:SelectTypes='Tout';
  let searchText:string='';
  const dataToSort = createDataToSort({
      pgs:data.pgs,
      fams:data.fams,
      boquettes:data.boquettes
  });

  let topNegatsInput = '';
  let currentTopNegats = NaN;
  const topsNegats:{[key:number]:typeof data.topNegats} = {NaN:data.topNegats}
  async function changeTopNegatsProms(){
    if(Object.keys(topsNegats).includes(topNegatsInput)){
      return currentTopNegats = parseInt(topNegatsInput);
    }
    const r = await fetch('/tafferie?proms=' + topNegatsInput, {method:'GET'});
    const topNegats = JSON.parse(await r.text()) as typeof data.topNegats;
    if(topNegats.length){
      topsNegats[topNegats[0].proms] = topNegats;
      currentTopNegats = topNegats[0].proms;
    } else {
      currentTopNegats = NaN;
    }
  }
</script>

<div class="flex flex-col gap-5 w-screen items-center">
  <div class="flex rounded-md overflow-clip bg-white w-11/12">
    <select bind:value={selected} class="p-2">
      {#each Object.keys(tableHeaders) as t}
        <option value={t}>{t}</option>
      {/each}
    </select>
    <input bind:value={searchText} class="p-2" type="text" placeholder="recherche: {selected}">
  </div>

    <Search 
        bind:searchText={searchText} 
        bind:selected={selected} 
        dataToSort={dataToSort}
        tableHeaders={tableHeaders}>
        <svelte:fragment slot="Boquette" let:sI>
          <th>{sI.boquette.id_boquette}</th>
          <td>{sI.boquette.nom}</td>
          <td><MoneyColor auto={sI.boquette.solde}/></td>
          <td><a href="/tafferie/boquette-{sI.boquette.id_boquette}" class="bg-gray-500 p-1 text-gray-300 rounded-lg">Panel</a></td>
        </svelte:fragment>

        <svelte:fragment slot="Fams" let:sI>
          <th>{sI.fams.nums}</th>
          <td><MoneyColor auto={sI.fams.solde}/></td>
          <td><a href="/tafferie/fams-{sI.fams.nums}" class="bg-gray-500 p-1 text-gray-300 rounded-lg">Panel</a></td>
        </svelte:fragment>

        <svelte:fragment slot="PG" let:sI>
          <th>{sI.pg.nums}Ch{sI.pg.proms}</th>
          <td>{sI.pg.bucque}</td>
          <td><MoneyColor auto={sI.pg.solde}/></td>
          <td><a href="/tafferie/profile-{sI.pg.id_pg}" class="bg-gray-500 p-1 text-gray-300 rounded-lg">Panel</a></td>
        </svelte:fragment>

      </Search>
 

    <div class="w-11/12">
      <SectionCard title="Fonds | Negats">
        <div class="flex gap-5">
          <div class="flex flex-col gap-2">
            <p class="text-white text-center">Sommes de tous les soldes des pg par proms</p>
            <div class="flex flex-col p-2 bg-white rounded-lg text-xl">
              <p class="text-center font-bold">Fonds Proms</p>
              {#each Object.entries(data.fondsProms) as [proms, solde]}
                <div class="flex text-white gap-3">
                  <p class="text-black">{proms}:</p>
                  <MoneyColor auto={solde} myClass="ml-auto mr-0"/>
                </div>  
              {/each}
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-white text-center">Sommes de tous les negat's des pg par proms</p>
            <div class="flex flex-col p-2 bg-white text-xl rounded-lg">
              <p class="text-center font-bold">Negats Proms</p>
              {#each Object.entries(data.negatsProms) as [proms, solde]}
                <div class="flex text-white gap-3 ">
                  <p class="text-black ">{proms}:</p>
                  <MoneyColor auto={solde} myClass="ml-auto mr-0"/>
                </div>  
              {/each}
            </div>
          </div>
        </div>
      </SectionCard>  
    </div>

    <div class="w-11/12 h-0">
      <SectionCard title="TOP Négat's">
        <form action="" class="w-full">
          <label class="w-full">
            <p class="font-zagoth text-white text-2xl">Proms</p>
            <input bind:value={topNegatsInput} type="number" class="w-full p-1">
          </label>
          <MyButton value="Valider" callback={changeTopNegatsProms}/>
        </form>
        
        <CustomTable headers={['Nums','Bucque','Solde','Action']}>
          {#each topsNegats[currentTopNegats] as pg}
            <tr>
              <th>{pg.nums}Ch{pg.proms}</th>
              <td>{pg.bucque}</td>
              <td><MoneyColor auto={pg.solde}/></td>
              <td><a href="/tafferie/profile-{pg.id_pg}" class="bg-gray-400 p-1 rounded-md">Profil</a></td>
            </tr>
          {/each}
        </CustomTable>
      </SectionCard>
    </div>
</div>