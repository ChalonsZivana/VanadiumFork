<script lang="ts">
  export let user:User;

  import SectionCard from "$lib/components/SectionCard.svelte";
  import type { User } from "$lib/server/auth";
    import Special from "../miscellaneous/Special.svelte";

  export const title = 'Profil';
  export let taferie = false;

  const soldes = {"Fonds":user.pg?.solde, "Fonds Fams":user?.fams?.solde}
</script>

<SectionCard 
title="Profil">
<div class="text-white w-full flex flex-col ">    
    <p>Prénom: {user.pg.prenom}</p>
    <p>Nom: {user.pg.nom}</p>
    <p>Bucque: {user.pg.bucque}</p>
  
    <Special special={[11,89,111].includes(user.pg.nums??-1)}>
      <p>Nums: {user.pg.nums}</p>
    </Special>
    <p>Email: {user.pg.email}</p>

    <div class="flex justify-around">
      {#each Object.entries(soldes) as [title, solde]}
        <a href="{taferie ?'':'/rechargement'}">
          <button class={`flex flex-col items-center mt-5 rounded-md p-1 w-28 
            ${(solde>=0)?"bg-green-600 hover:bg-green-400":"bg-red-600 hover:bg-red-400"}`} >
            <p>{title}</p><p>{solde}€</p>
          </button>
        </a>
      {/each}
    </div>
    <slot/>
</div>
</SectionCard>
