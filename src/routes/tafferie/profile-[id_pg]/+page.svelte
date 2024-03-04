<script lang="ts">
  import SearchItemsTable from "$lib/components/miscellaneous/SearchItemsTable.svelte";
import SectionCard from "$lib/components/section_card.svelte";
import Profile from "$lib/components/sections/Profile.svelte";
  import MyButton from "$lib/components/utils/MyButton.svelte";
    import ValidationDialog from "$lib/components/utils/ValidationDialog.svelte";

  export let data;

  let editPGHidden = true;
  const showPGEdit = () => {
    editInputText = initPGEdit();
    editPGHidden = false;
  }

  let dialog:HTMLDialogElement;

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

<div class="flex flex-col w-11/12 gap-2">
  <Profile user={data.user}>
    <button on:click={()=>dialog.showModal()} class="w-8 absolute top-3 right-3">
      <img src="/svgs/settings.svg" alt="setings">
    </button>

    <div class="w-full flex justify-center">
      <button on:click={()=>fondsToFamsValidation=true} class="mt-5 p-2 bg-yellow-600 w-fit">transférer Fonds vers Fonds Fams</button>
    </div>
  </Profile>

  <SectionCard title="Gestion Brousouffs">
    <div class="flex flex-col items-center gap-2 w-full">
      <label class="full w-5/6">
        <p class="text-white font-zagoth text-xl">Montant</p>
        <input class="w-full p-1 rounded-lg" type="number" placeholder="positif ou négatif">
      </label>
      <label class="w-5/6">
        <p class="text-white font-zagoth text-xl">Libellé</p>
        <input class="w-full p-1 rounded-lg" type="text" placeholder="donation pour le V. Le'Me">
      </label>
      <MyButton value="transférer" callback={()=>{}}/>
    </div>
  </SectionCard>

  <SectionCard title="Historique rhopses">
    <div class="w-full h-96 overflow-x-hidden no-scrollbar overflow-y-scroll">
      <SearchItemsTable
      title=''
      headers={['Date','Libellé','Montant','Statut','Action']}>
      {#each data.consommations as cons}
        <tr>
          <td>
            <p>{cons.date_conso.toLocaleDateString()}</p>
            <p>{cons.date_conso.toLocaleTimeString()}</p>
          </td>
          <td>{cons.libelle}</td>
          <td>
            <p class="text-red-500">Av: {cons.solde_avant}€</p>
            <p class="text-sm font-bold">{cons.debit}€</p>
            <p class="text-green-500">Ap: {cons.solde_apres}€</p>
          </td>
          <td>Actif</td>
          <td><button class="bg-red-400 p-1 rounded-lg">annuler</button></td>
        </tr>
      {/each}
    </SearchItemsTable>
    </div>
  </SectionCard>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:click|self={()=>dialog.close()} class=" duration-200 w-screen p-2 bg-white rounded-xl">
    <p class="text-xl font-bold">Edition PG - {data.user.pg.nums}Ch{data.user.pg.proms}</p>

    {#each editDataKeys as k}
      <label class="w-full">
        <p class="font-zagoth text-xl">{k}</p>
        <input bind:value={editInputText[k]} class="w-full p-1 h-8 border-gray-300 border-1 rounded-md" type="text">
      </label>
    {/each}

    <div class="flex flex-col">
      <label><input bind:checked={activCheck} type="checkbox">Compte actif</label>
      <label><input type="checkbox">Délégué de proms (DDP)</label>
    </div>

    <div class="flex flex-col items-center mt-5 gap-1 w-full">
      <MyButton value="Sauvergarder"/>
      <MyButton value="annuler" callback={()=>dialog.close()} color="bg-red-600"/>
    </div>
</dialog>

<ValidationDialog 
  title="Transfert de Fonds" 
  content="transférer les fonds"
  callback={()=>{}}
  bind:showModal={fondsToFamsValidation}>
</ValidationDialog>
