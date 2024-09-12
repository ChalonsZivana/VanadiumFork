<script lang="ts">
  import ToggleSectionCard from "$lib/components/ToggleSectionCard.svelte";
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
  import Special from "$lib/components/miscellaneous/Special.svelte"
  import MoneyColor from "$lib/components/miscellaneous/MoneyColor.svelte"
  import FullSearch from "$lib/components/search/consommations/FullSearch.svelte";
    import type { consommationsSearch } from "$lib/components/search/consommations/fullsearch.js";
    import Negats from "$lib/components/pg/Negats.svelte";

  
  export let data;
  export let form:{search:Awaited<ReturnType<typeof consommationsSearch>>};

  let currData:typeof form.search | null;
  $:currData = form ? form.search: null;  
  $: nombrePages =  Math.ceil((currData?.totalCons ?? 0) / 100);


  function copyEmail(email:string){
    navigator.clipboard.writeText(email);
  }
</script>

<div class="w-11/12 mt-5 mb-5">
  <Negats negats={data.negats}/>
</div>

<div class="w-11/12 mt-5 mb-5">
  <ToggleSectionCard show={true} title="Proms {data.proms}" toggleClass="h-96">
    <div class="w-full h-full overflow-y-scroll">
      <CustomTable elements={data.pgs} headers={['PG','Bucque','Solde','Email']}>
        <tr class="text-xxs" slot="tbody" let:e>
          <th class="p-2">
            <Special special={[11,89,111].includes(e.nums??-1)}>
              {e.nums}Ch{e.proms}
            </Special>
          </th>
          <td>{e.bucque}</td>
          <td>
            <MoneyColor auto={e.solde} className="text-xs font-bold"/>
          </td>
          <td>
            {#if  e.email != ''}
              <button on:click={()=>copyEmail(e.email)} class="p-2 bg-blue-500 active:bg-blue-400 text-white">copier email</button>
            {:else}
              <p>email absent</p>
            {/if}
          </td>
          
        <tr/>
      </CustomTable>
    </div>
  </ToggleSectionCard>
</div>

<div class="w-11/12 mt-5">
  {#await currData?.consommations}
    Chargement Historique Général
  {:then consommations} 
    <FullSearch 
    fromOption={true}
    cancelOption={false}
    title="< Historique Général >" 
    totalCons={currData?.totalCons ?? 0}
    nombrePages={nombrePages}
    consommations={consommations ?? []}
    page={currData?.page ?? 1}
    types={{"Opérations PG":"pg_boq", "Opérations Taferie":"ext_boq"}}>
    <svelte:fragment slot="proms">
        <input type="hidden" name="proms" value={data.proms}>
        <input disabled class="w-32" type="number" value={data.proms}>
    </svelte:fragment>
  </FullSearch>
  {/await}
</div>
