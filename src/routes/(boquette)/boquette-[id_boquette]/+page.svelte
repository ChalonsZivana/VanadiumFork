<script lang="ts">
  import Rhopse from "$lib/components/boquette/Rhopse.svelte";
  import Produits from "$lib/components/boquette/Produits.svelte";
  import Actions from "$lib/components/boquette/Actions.svelte";
  import CustomDialog from '$lib/components/miscellaneous/CustomDialog.svelte';
  import type { boquettes } from '@prisma/client'
  import Logout from '$lib/components/svgs/logout.svelte';
  import Settings from '$lib/components/svgs/settings.svelte';
  import BoquetteProfile from "$lib/components/profiles/BoquetteProfile.svelte";
  import Bolt from "$lib/components/svgs/bolt.svelte";
  
  export let data;
  let dialog:HTMLDialogElement;

  let boquette:boquettes;
  type boqSettingsText = {'Nom':string,'Nom Simple':string,'Nouveau Mot de passe':string,'Confirmation mot de passe :':string};
  type boqSettingsCheck = {'Partie PG':boolean};
  let editInputText:boqSettingsText;
  let editInputCheck:boqSettingsCheck;
  let editDataKeys: (keyof typeof editInputText)[];
  $:boquette = data.BOQUETTES.find(e=>e.id_boquette == data.id_boquette) ?? data.BOQUETTES[0];
  $: {
    editInputText = initPGEdit(boquette);
    editInputCheck = {'Partie PG':boquette.partie_pg};     
    editDataKeys = Object.keys(editInputText) as (keyof typeof editInputText)[];
  }

  let special:string|null = null;
  $ : {
    if(data.id_boquette == 7) special = `boquette-${data.id_boquette}/special/foys` // Foys
    else if(data.id_boquette == 3) special = `boquette-${data.id_boquette}/special/auberge` // Auberge
  }
 
  function initPGEdit(boq:boquettes):boqSettingsText {
    return {
    'Nom':boq.nom ?? '',
    'Nom Simple':boq.nom_simple ?? '',
    'Nouveau Mot de passe':"",
    'Confirmation mot de passe :':""
    };
  }
</script>


<div class="w-11/12 flex flex-col gap-5 mt-5 mb-5">
  <BoquetteProfile boquette={boquette}>
    <form method="POST" action="/login?/logout">
      <input class="hidden" type="text" name="boquette" value={data.id_boquette}>
      <button class="w-8 absolute top-3 left-3">
        <Logout />
      </button>
    </form>
    <div class="flex absolute top-3 right-3 gap-2">
      {#if special != null}
        <a href={special} class="w-8">
          <Bolt/>
        </a>
      {/if}
      {#if boquette.id_boquette}
        <button on:click={()=>dialog.showModal()} class="w-8">
          <Settings/>
        </button>
      {/if}
    </div>
    
  </BoquetteProfile>
  <Actions boquette={boquette} categories={data.categories} products={data.produits}/>
  <Rhopse pgs={data.pgs} boquette={boquette}></Rhopse>
  
  <Produits categories={data.categories} produits={data.produits}/>

    <!-- <CreerCategorieEtProduit categories={data.categories} id_boquette={data.id_boquette}/> -->
</div>


<CustomDialog formAction="?/editBoquette" bind:dialog={dialog} title="Edition Boquette - {boquette.nom}"
  buttonText='Sauvegarder' callback={()=>{}}>
  {#each editDataKeys as k}
    <label class="w-full">
      <p class="font-zagoth text-xl text-white">{k}</p>
      <input bind:value={editInputText[k]} class="w-full p-1 h-8 border-gray-300 border-1 rounded-md" type="text">
    </label>
  {/each}

  <div class="flex flex-col text-white">
    <label><input bind:checked={editInputCheck['Partie PG']} type="checkbox">Partie PG</label>
  </div>
</CustomDialog>