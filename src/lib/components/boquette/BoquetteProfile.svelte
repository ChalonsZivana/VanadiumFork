<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import type { boquettes } from "@prisma/client";
  import Settings from "../svgs/settings.svelte";
  import EditBoquetteDialog from "./EditBoquetteDialog.svelte";
  import Bolt from "../svgs/bolt.svelte";

  export let boquette:boquettes;
  export let taferie = false;

  let specialRhopse:null|string;
  $: {
    if(boquette.id_boquette == 7) specialRhopse = `boquette-${boquette.id_boquette}/special/foys` // Foys
    else if(boquette.id_boquette == 3) specialRhopse = `boquette-${boquette.id_boquette}/special/auberge` // Auberge
    else specialRhopse = null;
  }
  let dialog:HTMLDialogElement;
</script>

<SectionCard 
title={boquette.nom??''}>
  <div class="flex flex-col w-full">
    <div class="text-white w-full flex justify-center items-center">    
      <div class="w-1/2 justify-self-start">
        <p>Nom: {boquette.nom}</p>
        <p>Identifiant: {boquette.nom_simple}</p>
        <label>
          <input disabled type="checkbox" checked={boquette.partie_pg}/> Partie PG
        </label>
      </div>

      <a href="{taferie ?'':'/rechargement'}">
        <button class={`flex flex-col items-center rounded-md p-1 w-28 
          ${(boquette.solde>=0)?"bg-green-600 hover:bg-green-400":"bg-red-600 hover:bg-red-400"}`} >
          <p>Profil</p><p>{boquette.solde}€</p>
        </button>
      </a>
  </div>
      <div class="flex gap-3 absolute top-3 right-3">
        {#if specialRhopse != null}
          <a href={specialRhopse} class="w-8">
            <Bolt/>
          </a>
        {/if}
      <button on:click={()=>dialog.showModal()} class="w-8">
        <Settings/>
      </button>
      </div>
    
    <slot/>
  </div>
</SectionCard>


<EditBoquetteDialog bind:boquette={boquette} bind:dialog={dialog}/>