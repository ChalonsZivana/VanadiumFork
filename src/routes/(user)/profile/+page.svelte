<script lang="ts">
  import Profile from "$lib/components/sections/Profile.svelte";
  import type { SessionData } from "$lib/server/auth";
  import SectionCard from '$lib/components/section_card.svelte';
  import MyButton from "$lib/components/utils/MyButton.svelte";

  export let data:{session:SessionData,photo:string, photosFolder:string};
  export let form;

  
  const dossiersGifs = {
    "gifs filles":"gif",
    "gifs garçons":"gifF",
    "gifs mixte":"gifHF",
    "photos animaux":"animaux",
    "photos filles":"jolie",
    "photos garçons":"jolieF",
    "photos motos":"moto",
    "photos paysage":"paysage",
    "photos voitures":"voiture"
  }
  let currentFolder = data.photosFolder;
  const sendChange = ()=>{
    fetch('/profile',
    {
      method:"POST",
      body:JSON.stringify(currentFolder),
    });
  }
</script>


<div class="flex flex-col h-full md:h-auto justify-center items-center">
  <div class="h-full flex flex-col  md:grid gap-5 grid-cols-2 grid-rows-2">
    <div class="w-80"><Profile user={data.session.user}/></div>
    
    <SectionCard title="Dossier Gifs">
      <select bind:value={currentFolder} class="text-black" on:change={sendChange}>
        {#each Object.entries(dossiersGifs) as [nom, dossier]}
          <option value={dossier}>{nom}</option>
        {/each}
      </select>
    </SectionCard>

    <form class="w-80" action="?/change_password" method="post">
      
      <SectionCard title="Changer de mot de passe">
        <input name="P" class='text-black rounded-md w-52' type="password" placeholder="Mot de passe">
        {#if form?.wrong}
          <p class="text-red-500">Mauvais mot de passe</p>
        {/if}
        <input name="NP" class='text-black rounded-md w-52' type="password" placeholder="Nouveau mot de passe">
        <input name="RP" class='text-black rounded-md w-52' type="password" placeholder="Confirme le mot de passe">
        {#if form?.different}
          <p class="text-red-500">Les mots de passe sont différents</p>
        {/if}
        {#if form?.missing}
          <p class="text-red-500">Tous les champs sont obligatoires</p>
        {/if}
        <MyButton value="confirmer"/>
      </SectionCard>
    </form>
  </div>
</div>


<!-- <div class="flex flex-col md:flex-row items-center gap-5 h-full"> 
  <div class="h-20"></div>

  <div class="w-5/6">
    <Profile></Profile>
  </div>
  <div class="w-5/6">
    <PasswordChange></PasswordChange>
  </div>
</div> -->