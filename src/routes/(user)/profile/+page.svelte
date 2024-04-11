<script lang="ts">
  import Profile from "$lib/components/profiles/UserProfile.svelte";
  import type { User } from "$lib/server/auth";
  import SectionCard from '$lib/components/SectionCard.svelte';
  import MyButton from "$lib/components/miscellaneous/MyButton.svelte";

  export let data:{USER:User,photo:string, photosFolder:string};
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
  // onMount(async ()=>{
  //   console.log(OneSignal)
  //   console.log(OneSignal.isPushNotificationsEnabled())
  // })
</script>


  <div class="mt-5 h-full w-11/12 flex flex-col  md:grid gap-5 grid-cols-2 grid-rows-2">
    <Profile user={data.USER}/>
    
    <SectionCard title="Dossier Gifs">
      <select bind:value={currentFolder} class="text-black w-80 text-2xl" on:change={sendChange}>
        {#each Object.entries(dossiersGifs) as [nom, dossier]}
          <option value={dossier}>{nom}</option>
        {/each}
      </select>
    </SectionCard>

    <form action="?/change_password" method="post">
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

    <div class="flex flex-col gap-5">
      <SectionCard title="Ajouter boquette">
        <a href="/login" class="bg-blue-600 p-2 rounded-md">Se connecter</a>
      </SectionCard>
      <SectionCard title="Notifications">
        <form method="post" action="?/create_user">
          <button class="p-2 bg-blue-600">Create user</button>
        </form>
        <!-- {#if areNotifsAllowed != null}
          {#if areNotifsAllowed}
            <button on:click={()=>{
            }} class="bg-blue-600 p-2 rounded-md">se désabonner</button>
          {:else}
            <button on:click={async()=>{
              const r = await Notification.requestPermission()
              areNotifsAllowed = r == 'granted'
              OneSignal.setConsentGiven(true);
            }} class="bg-blue-600 p-2 rounded-md">s'abonner</button>
          {/if}
        {/if} -->
      </SectionCard>
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