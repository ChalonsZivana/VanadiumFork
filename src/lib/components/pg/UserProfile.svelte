<script lang="ts">
  export let user:User;
  import Settings from "$lib/components/svgs/settings.svelte";

  import SectionCard from "$lib/components/SectionCard.svelte";
  import type { User } from "$lib/server/auth";
    import Special from "../miscellaneous/Special.svelte";
    import EditPgDialog from "$lib/components/pg/EditPgDialog.svelte";

  export const title = 'Profil';
  export let taferie = false;

  let dialogSettings:HTMLDialogElement;

  const soldes = {"Fonds":user.pg?.solde, "Fonds Fams":user?.fams?.solde}
</script>

<SectionCard title="Profil">
<div class="text-white w-full flex flex-col ">    
    <p>Prénom: {user.pg.prenom}</p>
    <p>Nom: {user.pg.nom}</p>
    <p>Bucque: {user.pg.bucque}</p>
  
    <Special special={[11,89,111].includes(user.pg.nums??-1)}>
      <p>Nums: {user.pg.nums}</p>
    </Special>
    <p>Proms: {user.pg.proms}</p>
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
    <div class="absolute top-3 right-3 flex gap-4">
      {#if user.pg.ddp}
        <a href="ddp" class:pointer-events-none={taferie}>
          <div class="p-1 border-1 border-white rounded-xl">
            DDP
          </div>
        </a>
      {/if}
      {#if taferie}
        <button on:click={()=>dialogSettings.showModal()} class="w-8">
          <Settings/>
        </button>      
      {/if}
    </div>
   
</div>

</SectionCard>


<EditPgDialog bind:dialog={dialogSettings} pg={user.pg}/>
