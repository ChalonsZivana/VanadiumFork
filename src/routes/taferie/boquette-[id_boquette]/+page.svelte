<script lang="ts">
  import Settings from "$lib/components/svgs/settings.svelte";
  import CustomDialog from "$lib/components/miscellaneous/CustomDialog.svelte";
  import BoquetteProfile from "$lib/components/profiles/BoquetteProfile.svelte";
  import FullSearch from "$lib/components/search/FullSearch.svelte";
  import Actions from "$lib/components/boquette/Actions.svelte";
  import GestionBrousouffs from "$lib/components/miscellaneous/GestionBrousouffs.svelte";
    import Popup from "$lib/components/miscellaneous/Popup.svelte";

  export let data;
  export let form:{search:typeof data.search, success:boolean, message:string};
  
  let dialogSettings:HTMLDialogElement;

  let currData:typeof data.search;
  $:currData = form ? form.search : data.search;  
  $: nombrePages = Math.ceil(currData.totalCons / 100);

  const boqEdits = {
    'Nom':data.boquette.nom,
    'Identifiant':data.boquette.nom_simple,
    'Nouveau mot de passe':"",
    'Confirmation nouveau mot de passe':''
  }
</script>

<Popup bind:form={form}/>

<div class="w-11/12 flex flex-col pt-5 gap-5">
  <BoquetteProfile boquette={data.boquette} taferie={true}>
    <button on:click={()=>dialogSettings.showModal()} class="w-8 absolute top-3 right-3">
      <Settings/>
    </button>

    <GestionBrousouffs/>
  </BoquetteProfile>

  <Actions boquette={data.boquette} categories={data.categories} products={data.produits}>
    <button>
      <a href="/taferie/boquette-{data.boquette.id_boquette}/editproducts">éditer produits</a>
    </button>
  </Actions>
  
  {#await currData.consommations}
    Chargement Historique Général
  {:then consommations} 
    <FullSearch 
    title="< Historique Général >" 
    totalCons={currData.totalCons}
    nombrePages={nombrePages}
    consommations={consommations}
    page={currData.page}
    types={{"Opérations PG":"pg_boq", "Opérations Taferie":"ext_boq"}}/>
  {/await}
</div>


<CustomDialog formAction="/boquette-{data.boquette.id_boquette}?/editBoquette" bind:dialog={dialogSettings} title="Edition Boquette - {data.boquette.nom}"
  buttonText='Sauvegarder' >
  {#each Object.entries(boqEdits) as [nom, value]}
    <label class="w-full">
      <p class="font-zagoth text-xl text-white">{nom}</p>
      <input name={nom} value={value} class="w-full p-1 h-8 border-gray-300 border-1 rounded-md" type="text">
    </label>
  {/each}

  <div class="flex flex-col text-white">
    <label><input type="checkbox" name="Partie PG" checked={true}>Partie PG</label>
  </div>
</CustomDialog>