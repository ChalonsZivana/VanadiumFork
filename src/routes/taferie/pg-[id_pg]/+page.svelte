<script lang="ts">
  import { enhance } from "$app/forms";
  import GestionBrousouffs from "$lib/components/miscellaneous/GestionBrousouffs.svelte";
  import UserProfile from "$lib/components/pg/UserProfile.svelte";
  import Popup from "$lib/components/miscellaneous/Popup.svelte";
  import ValidationButton from "$lib/components/miscellaneous/ValidationButton.svelte";
  import ConsoTable from "$lib/components/search/ConsoTable.svelte";

  export let data;
  export let form:{success:boolean, message:string};
</script>

<Popup bind:form={form}/>

<div class="flex flex-col w-11/12 gap-2 pt-5">
  {#key data.user}
  <UserProfile user={data.user} taferie={true}>
    

    <div class="w-11/12 self-center flex justify-center items-center flex-col">
      {#if data.user.pg.solde != 0}
        <form class="w-full" method="post" use:enhance>
          <ValidationButton formaction="?/fonds_ffams" text="Fonds ➔ Fonds Fams"/>
        </form>
      {:else if data.user.pg.ddp == false}
        <form class="w-full" method="post" use:enhance>
          <ValidationButton formaction="?/delete" text="Supprimer PG"/>
        </form>
      {/if}
      <GestionBrousouffs/>

      <form class="w-full" method="post" use:enhance>
        <ValidationButton formaction="?/change_password" text="Changer le mot de passe"/>
      </form>
    </div>
  </UserProfile>
  {/key}

  <div class="h-96 flex flex-col items-center variant-filled-primary p-1">
    {#await data.consommations}
      <p>Chargement...</p>
    {:then consommations} 
    <ConsoTable fromOption={false} cancelOption={true} {consommations}/>

    {/await}
  </div>
</div>


