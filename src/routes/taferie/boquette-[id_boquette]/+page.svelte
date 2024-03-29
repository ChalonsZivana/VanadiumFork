<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
  import MoneyColor from "$lib/components/miscellaneous/MoneyColor.svelte";
  import { enhance } from "$app/forms";
  import Settings from "$lib/components/svgs/settings.svelte";
  import AddRemoveConso from "$lib/components/miscellaneous/AddRemoveConso.svelte";
  import CustomDialog from "$lib/components/miscellaneous/CustomDialog.svelte";
  import SquareRightArrow from "$lib/components/svgs/square-right-arrow.svelte";
    import BoquetteProfile from "$lib/components/profiles/BoquetteProfile.svelte";
    import FullSearch from "$lib/components/search/FullSearch.svelte";

  export let data;
  export let form:{consommations:typeof data.consommations, page:number, totalCons:number};
  
  let dialogSettings:HTMLDialogElement;
  $: consomms =form ?  form.consommations : data.consommations;
  $: page = form ? form.page : 1;
  $: totalCons = form ? form.totalCons : data.totalCons;
  $: nombrePages =Math.ceil(totalCons / 100);

  const boqEdits = {
    'Nom':data.boquette.nom,
    'Identifiant':data.boquette.nom_simple,
    'Nouveau mot de passe':"",
    'Confirmation nouveau mot de passe':''
  }
</script>

<div class="w-11/12 flex flex-col pt-5 gap-5">
  <BoquetteProfile title="Profil" boquette={data.boquette} taferie={true}>
    <button on:click={()=>dialogSettings.showModal()} class="w-8 absolute top-3 right-3">
      <Settings/>
    </button>
  </BoquetteProfile>
  <FullSearch 
    title="< Historique Général >" 
    totalCons={totalCons}
    nombrePages={nombrePages}
    consommations={consomms}
    page={page}
    types={{"Opérations PG":"pg_boq", "Opérations Taferie":"boq_ext"}}/>
</div>


<CustomDialog formAction="?/editBoquette" bind:dialog={dialogSettings} title="Edition Boquette - {data.boquette.nom}"
  buttonText='Sauvegarder' callback={()=>{}}>
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