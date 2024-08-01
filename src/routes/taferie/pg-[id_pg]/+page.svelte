<script lang="ts">
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import MoneyColor from "$lib/components/miscellaneous/MoneyColor.svelte";
  import AddRemoveConso from "$lib/components/miscellaneous/AddRemoveConso.svelte";
  import Settings from "$lib/components/svgs/settings.svelte";
  import { enhance } from "$app/forms";
  import GestionBrousouffs from "$lib/components/miscellaneous/GestionBrousouffs.svelte";
  import UserProfile from "$lib/components/pg/UserProfile.svelte";
  import Popup from "$lib/components/miscellaneous/Popup.svelte";
  import ValidationButton from "$lib/components/miscellaneous/ValidationButton.svelte";
  import EditPgDialog from "$lib/components/pg/EditPgDialog.svelte";

  export let data;
  export let form:{success:boolean, message:string};

  let dialogSettings:HTMLDialogElement;

  const editInputCheck = {
    'Actif':data.user.pg.actif
  } 
  let activCheck:boolean;
  $:editInputCheck.Actif = activCheck;
</script>

<Popup bind:form={form}/>

<div class="flex flex-col w-11/12 gap-2 pt-5">
  {#key data.user}
  <UserProfile user={data.user} taferie={true}>
    <button on:click={()=>dialogSettings.showModal()} class="w-8 absolute top-3 right-3">
      <Settings/>
    </button>

    <div class="w-11/12 self-center flex justify-center items-center flex-col">
      {#if data.user.pg.solde == 0}
        <form class="w-full" method="post" use:enhance>
          <ValidationButton formaction="?/delete" text="Supprimer PG"/>
        </form>
      {:else}
        <form class="w-full" method="post" use:enhance>
          <ValidationButton formaction="?/fonds_ffams" text="Fonds ➔ Fonds Fams"/>
        </form>
      {/if}      
      <GestionBrousouffs/>

      <form class="w-full" method="post" use:enhance>
        <ValidationButton formaction="?/change_password" text="Changer le mot de passe"/>
      </form>
    </div>
  </UserProfile>
  {/key}
  

  <SectionCard title="Historique rhopses">
    <div class="w-full h-96 overflow-x-hidden no-scrollbar overflow-y-scroll">
      
      {#await data.consommations}
        Chargement consommations...
      {:then consommations} 
        <CustomTable
        title=''
        headers={['Date','Libellé','Montant','']}
        elements={consommations}>
        <svelte:fragment slot="tbody" let:e>
          {#key e}
          <tr class={e.annule ? 'line-through decoration-2 decoration-black':''}>
            <td>
              <p>{e.date_conso.toLocaleDateString()}</p>
              <p>{e.date_conso.toLocaleTimeString()}</p>
            </td>
            <td class="text-wrap">{e.libelle}</td>
            <td>
              <p class="text-nowrap">AP. {e.solde_apres}€</p>
              <MoneyColor auto={e.montant} className="text-sm font-bold"/>
              <p>AV. {e.solde_avant}€</p>
            </td>
            <td>
              <AddRemoveConso id={e.id_conso} annule={e.annule}/>
            </td>
          </tr>
          {/key}
        </svelte:fragment>
      </CustomTable>
    {/await}
      
    </div>
  </SectionCard>
</div>

<EditPgDialog bind:dialog={dialogSettings} pg={data.user.pg}/>

