<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
  import MoneyColor from "$lib/components/miscellaneous/MoneyColor.svelte";
  import { enhance } from "$app/forms";
    import AddRemoveConso from "$lib/components/miscellaneous/AddRemoveConso.svelte";
  export let data;
  export let form;

  $: consomms =form ?  form.consommations : data.consommations;
  $: page = form ? form.page : 1;
  $: totalCons = form ? form.totalCons : data.totalCons;
  $: nombrePages =Math.ceil(totalCons / 100);
</script>

<div class="w-11/12">
  <SectionCard title="< Historique général >">
    <form use:enhance={() => async({update}) => update({reset:false})} 
      action="/tafferie/consommations?/consommations" method="post" class="flex flex-col gap-2">
      <p class="text-white">Total de {totalCons} consommation(s) sur {nombrePages} page(s). (100 par page)</p>

      <select name="type">
        <option value="h">Date/Heure</option>
        <option value="d">Débit</option>
        <option value="c">Crédit</option>
      </select>
      <select name="dir">
        <option value="c">Croissant</option>
        <option value="d">Décroissant</option>
      </select>
      <label class="w-full">
        <p class="text-white">Année de la consommation (vide pour toutes) :</p>
        <input name="year" class="w-full p-1 rounded-md" type="text" placeholder="Année: 1989">
      </label>
      <button class="self-center w-14">
        <img src="/svgs/square-arrow-right.svg" alt="">
      </button>

      <input bind:value={page} class="hidden" type="number" name="page">
      <div class="flex gap-2 justify-center">
        {#if page > 1}
          <button on:click={()=>page-=1} class="bg-white p-2 rounded-lg">précédent</button>
          <button on:click={()=>page=1} class="bg-white p-2 w-10 rounded-lg">1</button>
        {/if}
        <button class="bg-green-500 p-2 w-10 rounded-lg">{page}</button>
        {#if page < nombrePages}
          <button on:click={()=>page=nombrePages} class="bg-white p-2 w-10 rounded-lg">{nombrePages}</button>
          <button on:click={()=>page+=1} class="bg-white p-2 rounded-lg">suivant</button>
        {/if}
      </div>
    </form>
    <div class="w-full h-96 overflow-x-hidden no-scrollbar overflow-y-scroll">
    <CustomTable
      title=''
      headers={['Date','PG','Boq','Libellé','Montant','']}>
      {#each consomms as cons}
        <tr class="{cons.annule?'line-through':''}">
          <td><!-- Date -->
            <p>{cons.date_conso.toLocaleDateString()}</p>
            <p>{cons.date_conso.toLocaleTimeString()}</p>
          </td>
          <td>{cons.id_pg}</td><!-- Pg -->
          <td>{cons.id_boquette}</td><!-- Boquette -->
          <td>{cons.libelle}</td><!-- Libellé -->
          <td><!-- Montant -->
            <p>AV. {cons.id_boquette}€</p>
            <MoneyColor red={cons.debit} myClass="text-sm font-bold"/>
            <p>AP. {cons.solde_apres}€</p>
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