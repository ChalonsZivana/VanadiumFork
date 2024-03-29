<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import type { boquettes } from "@prisma/client";

  export let boquette:boquettes;
  export const title = 'Profil';
  export let taferie = false;
</script>

<SectionCard 
title={boquette.nom??''}>
<div class="text-white w-full flex justify-center items-center">    
    <div class="w-1/2 justify-self-start">
      <p>Nom: {boquette.nom}</p>
      <p>Identifiant: {boquette.nom_simple}</p>
      <label>
        <input type="checkbox" value={boquette.partie_pg}/> Partie PG
      </label>
    </div>

    <a href="{taferie ?'':'/rechargement'}">
      <button class={`flex flex-col items-center rounded-md p-1 w-28 
        ${(boquette.solde>=0)?"bg-green-600 hover:bg-green-400":"bg-red-600 hover:bg-red-400"}`} >
        <p>{title}</p><p>{boquette.solde}€</p>
      </button>
    </a>
    <slot/>
</div>
</SectionCard>
