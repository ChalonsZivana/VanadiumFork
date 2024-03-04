<script lang="ts">
  import SearchItemsTable from '$lib/components/miscellaneous/SearchItemsTable.svelte';

  export let data;

  const escapeRegExp = (txt:string) => txt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regexify = (txt:string) =>'\\b' + txt.split('').map(e=>e+'?').join('') + '\\b';

  type SelectTypes = 'PG' | 'Fams' | 'Boquette' | 'Tout';
 
  const tableHeaders:{[K in SelectTypes]:string[]} = {
    'Tout':[], 
    'PG':['Num','Bucque','Solde','Profil'],
    'Fams':['Fams','Solde','Historique'],
    'Boquette':['Id','Nom','Solde','Action']
  }


  interface Searchable { regex:RegExp; }
  interface Pg extends Searchable {pg:typeof data.pgs[0];}
  function createPg(pg:typeof data.pgs[0]) {
    let txt = `\\b${pg.nums}\\b|\\b${pg.proms}\\b` 
    if(pg.bucque) txt += `|\\b${escapeRegExp(pg.bucque)}\\b` //need to escapeRegex complex bucques
    return { regex:new RegExp(txt, 'g'), pg:pg, } // creates this /\b89\b|\b223\b/\bLe'Me\b/
  }
  interface Boquette extends Searchable {boquette:typeof data.boquettes[0];}
  function createBoquette(boq:typeof data.boquettes[0]):Boquette{
      let text:string[] = [];
      if(boq.nom_simple) text.push(regexify(boq.nom_simple));
      if(boq.nom) text.push(regexify(boq.nom));
      return {regex:new RegExp(text.join('|'), 'g'), boquette:boq}
  }
  interface Fams extends Searchable {fams:number}
  function createFams(fams:number):Fams{
      return {regex:new RegExp(`\\b${fams}\\b`, 'g'), fams:fams};
  }


  const dataToSort = {
    Fams:Array.from(Array(50).keys()).map(e=>createFams(e+1)),
    Boq:data.boquettes.map(e=>createBoquette(e)),
    PG:data.pgs.map(e=>createPg(e))
  };

  type searchItemsMap = { [K in SelectTypes]: 
    K extends 'PG' ?  Pg[] :
    K extends 'Fams' ?  Fams[] :
    K extends 'Boquette' ?  Boquette[] : [] };
  const searchItems:searchItemsMap={ 'PG':[],'Fams':[],'Boquette':[],'Tout':[] };

  let searchText:string="1";
  let selected:SelectTypes='Tout';

  $: {
    (()=>{
      const sT = searchText.toLowerCase().trimEnd();
      const l = sT.split(' ').length;

      switch(selected){
        case 'Tout':
        case 'PG':
          searchItems.PG = dataToSort.PG.filter(e => {
            const t = [...sT.matchAll(e.regex)].map(e=>e[0]);
            return t.length >= l
          });
          if(selected != 'Tout')break;
        case 'Fams':
          if(searchText == '') {
            searchItems.Fams = dataToSort.Fams;
            return;
          }
          searchItems.Fams = dataToSort.Fams.filter(e => {
            const t = [...sT.matchAll(e.regex)].map(e=>e[0]);
            return t.length >= l
          });
          if(selected != 'Tout')break;
        case 'Boquette':
          if(searchText == '') {
            searchItems.Boquette = dataToSort.Boq;
            return;
          }
          searchItems.Boquette = dataToSort.Boq.filter(e => {
            const t = [...sT.matchAll(e.regex)].map(e=>e[0]).filter(e=>e!='');
            return t.length >= l
          });
          break;
      }
    })();
    
  }

  const TAF_ROUTES = {
    "PG's":'',
    'Fams':'',
    'Boquettes':'',
    "Consomm's":'',
    "Boul's":'',
    "Inscription's":'',
    "Rembour's":'',
    "Tops":"",
  }
</script>

<div class="flex flex-col gap-5 w-screen items-center">
    <div class="flex rounded-lg overflow-clip">
      <select bind:value={selected}>
        {#each Object.keys(tableHeaders) as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
      <input bind:value={searchText} class="p-2" type="text" placeholder="recherche: {selected}">
    </div>
    <div class="{(searchItems[selected].length==0 && searchText=='')?'h-0':'h-96'} duration-200 flex flex-col overflow-y-scroll w-11/12 gap-2 bg-white rounded-lg overflow-clip">    
      {#if selected == 'Boquette' || selected == 'Tout' && searchItems.Boquette.length}
          <SearchItemsTable title="Boquette" headers={tableHeaders.Boquette}>
            {#each searchItems.Boquette as sI}
              <tr>
                <th>{sI.boquette.id_boquette}</th>
                <td>{sI.boquette.nom}</td>
                <td>10€</td>
                <td><a href="/tafferie/boquette-{sI.boquette.id_boquette}" class="bg-gray-500 p-1 text-gray-300 rounded-lg">Panel</a></td>
              <tr/>
            {/each}
          </SearchItemsTable>
      {/if}
      {#if selected == 'Fams' || selected == 'Tout' && searchItems.Fams.length}
          <SearchItemsTable title="Fams" headers={tableHeaders.Fams}>
            {#each searchItems.Fams as sI}
              <tr>
                <th>{sI.fams}</th>
                <td>10€</td>
                <td><a href="/tafferie/fams-{sI.fams}" class="bg-gray-500 p-1 text-gray-300 rounded-lg">Panel</a></td>
              <tr/>
            {/each}
          </SearchItemsTable>
      {/if}
      {#if selected == 'PG' || selected == 'Tout' && searchItems.PG.length}
          <SearchItemsTable title="PG" headers={tableHeaders.PG}>
            {#each searchItems.PG as sI}
              <tr>
                <th>{sI.pg.nums}Ch{sI.pg.proms}</th>
                <td>{sI.pg.bucque}</td>
                <td>{sI.pg.solde}€</td>
                <td><a href="/tafferie/profile-{sI.pg.id_pg}" class="bg-gray-500 p-1 text-gray-300 rounded-lg">Panel</a></td>
              <tr/>
            {/each}
          </SearchItemsTable>
      {/if}
    </div>
  </div>

<!-- <div class="grid self-center h-80 w-80 grid-cols-3 grid-rows-3 gap-2">
    {#each Object.entries(TAF_ROUTES) as [key, value]}
      <button class="bg-green-700 rounded-lg text-white">{key}</button>
    {/each}
  </div> -->
<!-- 
<div class="w-11/12 flex flex-col gap-5">
  <SectionCard title="Fonds Proms">
    <p class="text-white">Sommes de tous les soldes des pg par proms :</p>
    <div class="flex flex-col w-full">
      {#each Object.entries(data.fondsProms) as [proms, solde]}
        <div class="flex text-white gap-3">
          <p class=" font-bold">{proms}:</p>
          <p>{solde}€</p>
        </div>  
      {/each}
    </div>
  </SectionCard>

  <SectionCard title="Negat's Proms">
    <p class="text-white">Sommes de tous les negat's des pg par proms :</p>
    <div class="flex flex-col w-full">
      {#each Object.entries(data.negatsProms) as [proms, solde]}
        <div class="flex text-white gap-3">
          <p class=" font-bold">{proms}:</p>
          <p>{solde}€</p>
        </div>  
      {/each}
    </div>
  </SectionCard>

  <SectionCard title="Fonds Boquettes">
    <div class="flex flex-col w-full">
      {#each data.fondsBoquettes as boq}
        <div class="flex text-white gap-3">
          <p class=" font-bold">{boq.nom} :</p>
          <p>{boq.solde}€</p>
        </div>  
      {/each}
    </div>
  </SectionCard>

  <SectionCard title="Actions">

  </SectionCard>
</div> -->

