<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import type { boquettes } from "@prisma/client";
  import EditBoquetteDialog from "./EditBoquetteDialog.svelte";
  import Icon from "@iconify/svelte";

  export let boquette:boquettes;
  export let taferie = false;

  let specialRhopse:null|string;
  $: {
    specialRhopse = `boquette-${boquette.id_boquette}/special/rhopses`;
  }
  let dialog:HTMLDialogElement;
</script>

<SectionCard title={boquette.nom??''}>
  <div class="flex flex-col w-full">
    <div class="text-white w-full flex justify-center items-center">    
      <div class="w-1/2 justify-self-start">
        <p>Nom: {boquette.nom}</p>
        <p>Identifiant: {boquette.nom_simple}</p>
        <!-- <label>
          <input disabled type="checkbox" checked={boquette.partie_pg}/> Partie PG
        </label> -->
      </div>

      <a href="{taferie ?'':'/rechargement'}">
        <button class={`flex flex-col items-center rounded-md p-1 w-28 
          ${(boquette.solde>=0)?"bg-green-600 hover:bg-green-400":"bg-red-600 hover:bg-red-400"}`} >
          <p>Fonds</p><p>{boquette.solde}€</p>
        </button>
      </a>
  </div>
      <div class="flex gap-3 absolute top-3 right-3">
        {#if specialRhopse != null}
          <a href={specialRhopse} class="w-8">
            <Icon class="text-4xl" icon="mdi:lightning-bolt-circle"/>
          </a>
        {/if}
        <button on:click={()=>dialog.showModal()} class="w-8">
          <Icon class="text-4xl" icon="mdi:settings"/>
        </button>
      </div>
    
    <slot/>
  </div>
</SectionCard>


<EditBoquetteDialog bind:boquette={boquette} bind:dialog={dialog}/>