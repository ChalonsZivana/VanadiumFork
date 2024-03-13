<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import Rhopse from "$lib/components/sections/boquette/Rhopse.svelte";
  import Produits from "$lib/components/sections/boquette/Produits.svelte";
  import CreerCategorieEtProduit from "$lib/components/sections/boquette/CreerCategorieEtProduit.svelte";
  import GenererFeuilleRhopse from "$lib/components/miscellaneous/GenererFeuilleRhopse.svelte";
  import MoneyColor from '$lib/components/miscellaneous/MoneyColor.svelte';
  import CustomDialog from '$lib/components/miscellaneous/CustomDialog.svelte';
  import type { boquettes } from '@prisma/client'

  export let data;
  let dialog:HTMLDialogElement;

  let boquette:boquettes;
  type boqSettingsText = {'Nom':string,'Nom Simple':string,'Nouveau Mot de passe':string,'Confirmation mot de passe :':string};
  type boqSettingsCheck = {'Partie PG':boolean};
  let editInputText:boqSettingsText;
  let editInputCheck:boqSettingsCheck;
  let editDataKeys: (keyof typeof editInputText)[];
  $:boquette = data.session.boquettes.find(e=>e.id_boquette == data.id_boquette) ?? data.session.boquettes[0];
  $: {
    editInputText = initPGEdit(boquette);
    editInputCheck = {'Partie PG':boquette.partie_pg};     
    editDataKeys = Object.keys(editInputText) as (keyof typeof editInputText)[];
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


<div class="w-11/12 flex flex-col gap-5">
  <SectionCard title={boquette.nom??''}>
    <div class="w-full flex flex-col text-white">
      {#key boquette.solde}
        <MoneyColor myClass="text-3xl text-center" auto={boquette.solde}></MoneyColor>
      {/key}
    </div>

    <form method="POST" action="/login?/logout">
      <input class="hidden" type="text" name="boquette" value={data.id_boquette}>
      <button class="w-8 absolute top-3 left-3">
        <img src="/svgs/logout.svg" alt="setings">
      </button>
    </form>

    <button on:click={()=>dialog.showModal()} class="w-8 absolute top-3 right-3">
      <img src="/svgs/settings.svg" alt="setings">
    </button>
  </SectionCard>
  <GenererFeuilleRhopse products={data.produits}/>
  <Rhopse pgs={data.pgs}></Rhopse>

  <SectionCard title="Historique"></SectionCard>

  <Produits categories={data.categories} produits={data.produits}></Produits>
  <CreerCategorieEtProduit categories={data.categories} id_boquette={data.id_boquette}></CreerCategorieEtProduit>
</div>


<CustomDialog bind:dialog={dialog} title="Edition Boquette - {boquette.nom}"
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