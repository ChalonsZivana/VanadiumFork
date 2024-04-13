<script lang="ts">
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import MoneyColor from '$lib/components/miscellaneous/MoneyColor.svelte';
  import AddRemoveConso from "$lib/components/miscellaneous/AddRemoveConso.svelte";
  import GestionBrousouffs from "$lib/components/miscellaneous/GestionBrousouffs.svelte";
    import Popup from "$lib/components/miscellaneous/Popup.svelte";
  export let data;
  export let form:{success:boolean, message:string};
</script>

<Popup bind:form={form}/>

<div class="flex flex-col w-11/12 gap-2 pt-5">
  {#key data.fams}
    <SectionCard title="Fams {data.fams.nums}">
      <div class="flex flex-col items-center mt-5 rounded-md p-1 w-28 text-xl
        {(data.fams.solde>=0)?"bg-green-600 hover:bg-green-400":"bg-red-600 hover:bg-red-400"}">
        <p>Fonds</p>
        <p>{data.fams.solde}€</p>
      </div>
      <GestionBrousouffs/>
    </SectionCard>
  {/key}

  <SectionCard title="Historique fams">
    <div class="w-full h-96 overflow-x-hidden no-scrollbar overflow-y-scroll">
      <CustomTable
      title=''
      headers={['Date','Libellé','Montant','']}
      elements={data.historique_fams}>
      <svelte:fragment slot="tbody" let:e>
        {#key e}
        <tr class={e.annule ? 'line-through':''}>
          <td>
            <p>{e.date_conso?.toLocaleDateString()}</p>
            <p>{e.date_conso?.toLocaleTimeString()}</p>
          </td>
          <td>{e.libelle}</td>
          <td>
            <p>Av: {e.solde_avant}€</p>
            <MoneyColor auto={-e.montant} className="text-base font-bold"></MoneyColor>
            <p>Ap: {e.solde_apres}€</p>
          </td>
          <td>
            <AddRemoveConso id={e.id_conso} annule={e.annule}/>
          </td>
        </tr>
        {/key}
      </svelte:fragment>
    </CustomTable>
    </div>
  </SectionCard>
</div>
