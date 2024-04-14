<script lang="ts">
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import MoneyColor from "$lib/components/miscellaneous/MoneyColor.svelte";
  import AddRemoveConso from "$lib/components/miscellaneous/AddRemoveConso.svelte";
  import SubmitDialog from "$lib/components/miscellaneous/SubmitDialog.svelte";
  import Settings from "$lib/components/svgs/settings.svelte";
  import { enhance } from "$app/forms";
  import GestionBrousouffs from "$lib/components/miscellaneous/GestionBrousouffs.svelte";
  import UserProfile from "$lib/components/profiles/UserProfile.svelte";
  import Popup from "$lib/components/miscellaneous/Popup.svelte";
  import ValidationButton from "$lib/components/miscellaneous/ValidationButton.svelte";

  export let data;
  export let form:{success:boolean, message:string}

  let dialogSettings:HTMLDialogElement;

  let fondsToFamsValidation = false;

  function initPGEdit() {
    return {
    'Prenom':data.user.pg.prenom,
    'Nom':data.user.pg.nom,
    'Bucque':data.user.pg.bucque,
    'Adresse mail *':data.user.pg.email,
    'Nums *':data.user.pg.nums,
    'TBK':data.user.pg.tabagns,
    'Proms *':data.user.pg.proms,
    };
  }
  let editInputText = initPGEdit();
  const editInputCheck = {
    'Actif':data.user.pg.actif
  } 
  let activCheck:boolean;
  $:editInputCheck.Actif = activCheck ? 1 : 0;
  const editDataKeys = Object.keys(editInputText) as (keyof typeof editInputText)[]
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

<SubmitDialog formAction="?/editPG" bind:dialog={dialogSettings} title="Edition PG - {data.user.pg.nums}Ch{data.user.pg.proms}"
  buttonText='Sauvegarder'>
  {#each editDataKeys as k}
    <label class="w-full">
      <p class="font-zagoth text-xl text-white">{k}</p>
      <input bind:value={editInputText[k]} class="w-full p-1 h-8 border-gray-300 border-1 rounded-md" type="text">
    </label>
  {/each}

  <div class="flex flex-col text-white">
    <label><input bind:checked={activCheck} type="checkbox">Compte actif</label>
    <label><input type="checkbox">Délégué de proms (DDP)</label>
  </div>
</SubmitDialog>