<script lang="ts">
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import MyButton from "$lib/components/miscellaneous/MyButton.svelte";
  import MoneyColor from '$lib/components/miscellaneous/MoneyColor.svelte';
    import AddRemoveConso from "$lib/components/miscellaneous/AddRemoveConso.svelte";
  export let data;
</script>

<div class="flex flex-col w-11/12 gap-2">
  <SectionCard title="Fams {data.fams.nums}">
    <MoneyColor auto={data.fams.solde} myClass='text-2xl'/>
  </SectionCard>
  <SectionCard title="Gestion Brousouffs">
    <div class="flex flex-col items-center gap-2 w-full">
      <label class="full w-5/6">
        <p class="text-white font-zagoth text-xl">Montant</p>
        <input class="w-full p-1 rounded-lg" type="number" placeholder="positif ou négatif">
      </label>
      <label class="w-5/6">
        <p class="text-white font-zagoth text-xl">Libellé</p>
        <input class="w-full p-1 rounded-lg" type="text" placeholder="Y'a qu'la Fams 11 qui pine">
      </label>
      <MyButton value="transférer" callback={()=>{}}/>
    </div>
  </SectionCard>

  <SectionCard title="Historique fams">
    <div class="w-full h-96 overflow-x-hidden no-scrollbar overflow-y-scroll">
      <CustomTable
      title=''
      headers={['Date','Libellé','Montant','']}>
      {#each data.historique_fams as cons}
        <tr class={cons.annule ? 'line-through':''}>
          <td>
            <p>{cons.date_transaction?.toLocaleDateString()}</p>
            <p>{cons.date_transaction?.toLocaleTimeString()}</p>
          </td>
          <td>{cons.libelle}</td>
          <td>
            <p>Av: {cons.solde_avant}€</p>
            <MoneyColor green={cons.credit} red={cons.debit} myClass="text-base font-bold"></MoneyColor>
            <p>Ap: {cons.solde_apres}€</p>
          </td>
          <td>
            <AddRemoveConso bind:cons={cons}/>
          </td>
        </tr>
      {/each}
    </CustomTable>
    </div>
  </SectionCard>
</div>
