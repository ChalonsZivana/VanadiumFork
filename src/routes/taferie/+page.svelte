<script lang="ts">
  import CustomTable from '$lib/components/miscellaneous/CustomTable.svelte';
  import SectionCard from '$lib/components/SectionCard.svelte';
  import MyButton from '$lib/components/miscellaneous/MyButton.svelte';
  import MoneyColor from '$lib/components/miscellaneous/MoneyColor.svelte';
  import Search from '$lib/components/search/Search.svelte';
  import { createDataToSort, type SelectTypes } from "$lib/components/search/search.js";
  import ToggleSectionCard from '$lib/components/ToggleSectionCard.svelte';
  import Special from '$lib/components/miscellaneous/Special.svelte';
  import Logout from '$lib/components/svgs/logout.svelte';
  import ToggleButton from '$lib/components/miscellaneous/ToggleButton.svelte';
  import { enhance } from '$app/forms';
  import type { getTopNegats } from "$lib/server/db_connection";

  export let data;
  export let form:{topNegats:Awaited<ReturnType<typeof getTopNegats>>}
  
  const tableHeaders:{[K in SelectTypes]:string[]} = {
    'Tout':[], 
    'PG':['Num','Bucque','Nom','Solde'],
    'Fams':['Fams','Solde'],
    'Boquette':['Id','Nom','Solde']
  }
  let selected:SelectTypes='Tout';
  let searchText:string='';
  let searchNums:number=NaN;
  let searchProms:number=NaN;
  const dataToSort = Promise.all([data.pgs, data.fams, data.boquettes]).then((value)=>{
    return createDataToSort({pgs:value[0], fams:value[1], boquettes:value[2]});
  });
  //<iconify-icon icon="material-symbols:person-add"></iconify-icon>
</script>

<div class="w-11/12 mt-5 flex flex-col gap-5">
  <div class="flex rounded-md w-full">
    <select bind:value={selected} class="p-2 bg-red-100 border-2 border-black">
      {#each Object.keys(tableHeaders) as t}
        <option value={t}>{t}</option>
      {/each}
    </select>
    <input bind:value={searchText} class="p-2 outline-none bg-red-100 w-full border-2 border-black placeholder-gray-500" type="text" placeholder="texte: {selected}">
    <input bind:value={searchNums} class="p-1 outline-none text-black text-xs bg-red-100 w-16 border-2 border-black placeholder-gray-500" type="number" placeholder="nums">
    <input bind:value={searchProms} class="p-1 outline-none text-black text-xs bg-red-100 w-16 border-2 border-black placeholder-gray-500" type="number" placeholder="proms">
  </div>
  {#await dataToSort}
    Chargement...
  {:then dTS} 
    <div class="w-full">
      <Search 
        bind:searchProms={searchProms}
        bind:searchNums={searchNums}
        bind:searchText={searchText} 
        bind:selected={selected} 
        dataToSort={dTS}>    
        <svelte:fragment slot="Boquette" let:sIB> 
          <CustomTable title="Boquette" headers={tableHeaders.Boquette} elements={sIB}>
            <tr on:click={()=>location.href=`/taferie/boquette-${e.boquette.id_boquette}`} slot="tbody" let:e class="cursor-pointer">
              <th class="p-2">{e.boquette.id_boquette}</th>
              <td>{e.boquette.nom}</td>
              <!-- there is an issue with moneycolor, need for reload when create, resolved with key -->
              <td>{#key e} 
                <MoneyColor auto={e.boquette.solde}/>
              {/key}</td>
            </tr>
          </CustomTable>
        </svelte:fragment>
      
        <svelte:fragment slot="Fams" let:sIF>
          <CustomTable title="Fams" headers={tableHeaders.Fams} elements={sIF}>
            <tr on:click={()=>location.href=`/taferie/fams-${e.fams.nums}`} slot="tbody" let:e class="cursor-pointer">
              <th class="p-2">{e.fams.nums}</th>
              <td>{#key e}
                <MoneyColor auto={e.fams.solde}/>
              {/key}</td>
            </tr>
          </CustomTable>
        </svelte:fragment>
      
        <svelte:fragment slot="PG" let:sIP>
          <CustomTable title="PG" headers={tableHeaders.PG} elements={sIP}>
            <tr on:click={()=>location.href=`/taferie/pg-${e.pg.id_pg}`} slot="tbody" let:e class="cursor-pointer">
              <th class="p-2">
                <Special special={[11,89,111].includes(e.pg.nums??-1)}>
                  {e.pg.nums}Ch{e.pg.proms}
                </Special>
              </th>
              <td>{e.pg.bucque}</td>
              <td>{e.pg.nom} {e.pg.prenom}</td>
              <td>{#key e}
                  <MoneyColor auto={e.pg.solde}/>
              {/key}</td>
            <tr/>
          </CustomTable>
        </svelte:fragment>
      </Search>
    </div>
  {/await}
 
 

    <SectionCard title="Fonds | Negats">
      <form method="POST" action="/login?/logout">
        <input type="hidden" name="boquette" value={20}>
        <button class="w-8 absolute top-3 left-3">
          <Logout />
        </button>
      </form>
      <div class="flex flex-col gap-2">
        <div class="flex justify-center">
          <p class="text-white text-center">Sommes de tous les soldes des pg par proms</p>
        <p class="text-white text-center">Sommes de tous les negat's des pg par proms</p>
        </div>
          
        <div class="flex gap-5 justify-center text-black">
          {#each [data.fondsProms, data.negatsProms] as fonds}
            <div class="flex w-full flex-col p-2 bg-red-100 rounded-lg">
              <p class="text-center font-bold">Fonds Proms</p>
              {#each Object.entries(fonds) as [proms, solde]}
                <div class="flex gap-3">
                  <p>{proms}:</p>
                  <MoneyColor auto={solde} className="ml-auto mr-0"/>
                </div>  
              {/each}
            </div>
          {/each}
        </div>
      </div>
    </SectionCard>  

    <div>
      <ToggleSectionCard title="Actions" toggleClass="h-72">
        <div class="flex flex-col gap-2">
          <button class="bg-red-700 p-2 flex h-fit justify-around items-center">
            <a class="text-white text-2xl" href="/taferie/consommations">consommations</a>
          </button>
          <button class="bg-red-700 p-2 flex h-fit justify-around items-center">
            <a class="text-white text-2xl" href="/taferie/pgs">PGs</a>
          </button>
          <button class="bg-red-700 p-2 flex h-fit justify-around  items-center">
            <a class="text-white text-2xl" href="/taferie/inscription">inscription</a>
          </button>
            {#key data.config}
              <form class="bg-red-700 p-2 flex flex-col gap-2 justify-start w-full" action="">
                <p class="text-white text-2xl text-center">admin</p>
                <form use:enhance on:change={(e)=>e.currentTarget.requestSubmit()} action="?/vanazocque" method="post">
                  <ToggleButton name="vanazocque" isChecked={data.config.vanazocque?.valeur=='1'}/>
                </form>
                <form use:enhance on:change={(e)=>e.currentTarget.requestSubmit()}  action="?/lydiazocque" method="post">
                  <ToggleButton name="lydiazocque" isChecked={data.config.lydiazocque?.valeur=='1'}/>
                </form>
              </form>
            {/key}
      </ToggleSectionCard>
    </div>

    <div>
      <ToggleSectionCard title="Boquettes" toggleClass="h-96">
        <div class="h-full overflow-y-scroll">
          {#await data.boquettes}
          Chargement des boquettes...
          {:then boquettes} 
          <CustomTable elements={boquettes} headers={['Boquette','Solde']} title=''>
            <tr on:click={()=>location.href=`/taferie/boquette-${e.id_boquette}`} slot="tbody" let:e class="cursor-pointer">
              <th class="p-2">
                <a class="h-full w-full" href="/taferie/boquette-{e.id_boquette}">
                  {e.nom}
                </a>
              </th>
              <td>{#key e}
                  <MoneyColor auto={e.solde}/>
              {/key}</td>
            <tr/>
          </CustomTable>
          {/await}
        </div>
      </ToggleSectionCard>
    </div>

    <SectionCard title="TOP Négat's">
      <form method="post" action="?/topnegats" class="w-full">
        <label class="w-full">
          <p class="font-zagoth text-white text-2xl">Proms</p>
          <input name="proms" type="number" class="w-full bg-red-100 p-1 text-black">
        </label>
        <MyButton value="Valider"/>
      </form>

      {#if form}
        <CustomTable headers={['Nums','Bucque','Solde']} elements={form.topNegats}>
          <tr on:click={()=>location.href=`/taferie/pg-${e.id_pg}`} slot="tbody" let:e class="cursor-pointer divide-x-2 divide-white">
            <th class="p-2">
              <Special special={[11,89,111].includes(e.nums??-1)}>
                {e.nums}Ch{e.proms}
              </Special>
            </th>
            <td>{e.bucque}</td>
            <td><MoneyColor auto={e.solde}/></td>
          </tr>
        </CustomTable>
      {/if}
    </SectionCard>
</div>