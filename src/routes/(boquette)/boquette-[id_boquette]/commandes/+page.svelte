<script lang="ts">
  import SubmitDialog from '$lib/components/miscellaneous/SubmitDialog.svelte';
    import ValidationButton from '$lib/components/miscellaneous/ValidationButton.svelte';
  import type { commandes } from '@prisma/client';
  import { onMount } from 'svelte';

  export let data;
  export let dialog:HTMLDialogElement;

  $:commandesNonTraitées = data.commandesNonTraitees;
  $:commandesEnCours = data.commandesEnCours;
  $:commandesFinies = data.commandesFinies;

  let selectedCommande:commandes|null;
  onMount(()=>{
    let i = setInterval(updateData, 5000);
  });

  async function updateData(){
    const response = await fetch(window.location.pathname, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids:commandesNonTraitées.map(e=>e.id)
      }),
    });

    let result = await response.json() as {commandes:commandes[]};
    for(let e of result.commandes){
      e.date = new Date(e.date as any as string)
    }
    const new_commandes = [...commandesNonTraitées, ...result.commandes].sort((a,b) => a.date.getMilliseconds() - b.date.getMilliseconds());
    commandesNonTraitées = new_commandes;
  }

  function getStatut(statut:number){
    return ["Non Traité","En cours","Livré"][statut+1]
  }

  function emitDring(): void {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const context = new AudioContext();

    // Create an oscillator for the "dring" sound
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'triangle'; // "triangle" or "sine" waveform can sound bell-like
    oscillator.frequency.setValueAtTime(800, context.currentTime); // Start frequency

    // Fade out the sound (like a bell ringing out)
    gainNode.gain.setValueAtTime(1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.5); // Fade out over 1.5 seconds

    // Connect the oscillator to the gain node, and the gain node to the output (speakers)
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 1.5); // Stop after 1.5 seconds
  }
</script>

<div class="h-full w-full flex flex-col justify-center items-center p-2 gap-4">
  <!-- Statut -1 -->
  {#if commandesNonTraitées.length > 0}
    <div class="table-container w-full flex-grow">
      <!-- Native Table Element -->
      <table class="table">
        <thead>
          <tr>
            <th class="text-xs">Date</th>
            <th class="text-xs">De</th>
            <th class="text-xs">Libelle</th>
            <th class="text-xs">Statut</th>
          </tr>
        </thead>
        <tbody class="divide-y-2 divide-white">
          {#each commandesNonTraitées as commande}
          {@const date = commande.date.toLocaleString().split(' ')}

            <tr on:click={()=>{dialog.showModal();selectedCommande=commande}} class="decoration-2 divide-x-2 {['child:bg-green-300','child:bg-orange-300','child:bg-red-300'][commande.statut + 1]}">
              <td>{date[0]}<br>{date[1]}</td>
              <td>{commande.from}</td>
              <td>{commande.libelle}</td>
              <td>{getStatut(commande.statut)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- Statut 0 -->
 {#if commandesEnCours.length > 0}
   <div class="table-container w-full flex-grow">
    <!-- Native Table Element -->
    <table class="table">
      <thead>
        <tr>
          <th class="text-xs">Date</th>
          <th class="text-xs">De</th>
          <th class="text-xs">Libelle</th>
          <th class="text-xs">Statut</th>
        </tr>
      </thead>
      <tbody class="divide-y-2 divide-white">
        {#each commandesEnCours as commande}
        {@const date = commande.date.toLocaleString().split(' ')}
          <tr on:click={()=>{dialog.showModal();selectedCommande=commande}} class="decoration-2 divide-x-2 {['child:bg-green-300','child:bg-orange-300','child:bg-red-300'][commande.statut + 1]}">
            <td>{date[0]}<br>{date[1]}</td>
            <td>{commande.from}</td>
            <td>{commande.libelle}</td>
            <td>{getStatut(commande.statut)}</td>
          </tr>
          {/each}
      </tbody>
    </table>
  </div>
 {/if}
  <!-- Statut 1 -->
  {#if commandesFinies.length > 0}
  <div class="table-container w-full flex-grow">
    <!-- Native Table Element -->
    <table class="table">
      <thead>
        <tr>
          <th class="text-xs">Date</th>
          <th class="text-xs">De</th>
          <th class="text-xs">Libelle</th>
          <th class="text-xs">Statut</th>
        </tr>
      </thead>
      <tbody class="divide-y-2 divide-white">
        {#each commandesFinies as commande}
        {@const date = commande.date.toLocaleString().split(' ')}
          <tr on:click={()=>{dialog.showModal();selectedCommande=commande}} class="decoration-2 divide-x-2 {['child:bg-green-300','child:bg-orange-300','child:bg-red-300'][commande.statut + 1]}">
            <td>{date[0]}<br>{date[1]}</td>
            <td>{commande.from}</td>
            <td>{commande.libelle}</td>
            <td>{getStatut(commande.statut)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {/if}
</div>


<SubmitDialog bind:dialog={dialog} title="< Rhopser >">
  <p class="font-zagoth text-3xl text-center text-white">Commander</p>
  {#if selectedCommande}
    <table class="table mt-10 mb-10 text-white">
      <thead>
        <tr>
          <th class="text-xs">De</th>
          <th class="text-xs">Libelle</th>
          <th class="text-xs">Statut</th>
        </tr>
      </thead>
      <tbody class="divide-y-2 divide-white">
            <tr class="decoration-2 divide-x-2 {['child:bg-green-300','child:bg-orange-300','child:bg-red-300'][selectedCommande?.statut ?? 0 + 1]}">
              <td>{selectedCommande.from}</td>
              <td>{selectedCommande.libelle}</td>
              <td>{getStatut(selectedCommande.statut)}</td>
            </tr>
      </tbody>
    </table>

    <input type="hidden" name="id" bind:value={selectedCommande.id}>

    <div class="flex w-full justify-around  gap-4 items-center">
      {#if selectedCommande.statut != -1}
        <ValidationButton formaction="?/setStatus_1" text="Non traité"/>
      {/if}
      {#if selectedCommande.statut != 0}
        <ValidationButton formaction="?/setStatus0" text="En cours"/>
      {/if}
      {#if selectedCommande.statut != 1}
        <ValidationButton formaction="?/setStatus1" text="Fini"/>
      {/if}
    </div>
  {/if}
    <svelte:fragment slot="submitButton">
      <div></div>
    </svelte:fragment>

</SubmitDialog>