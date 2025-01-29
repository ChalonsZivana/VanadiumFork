<script lang="ts">
  import SubmitDialog from '$lib/components/miscellaneous/SubmitDialog.svelte';
    import ValidationButton from '$lib/components/miscellaneous/ValidationButton.svelte';
    import Icon from '@iconify/svelte';
  import type { commandes } from '@prisma/client';
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
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
    if(commandesNonTraitées.length != new_commandes.length){
      emitDring();
    }
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

<div class="h-full w-full flex flex-col justify-start items-start p-2 gap-4 {commandesNonTraitées.length?'':''}">
  <Accordion autocollapse={true} >
    <!-- Statut 1 -->
    <AccordionItem open class="{commandesNonTraitées.length>0?'bg-red-600':''}">
      <svelte:fragment slot="lead">
        <Icon icon="mdi:alert-decagram"/>
      </svelte:fragment>
		  <svelte:fragment slot="summary">
        <p class="text-xl">Commandes non traitées - {commandesNonTraitées.length}</p>
      </svelte:fragment>
		  <svelte:fragment slot="content">
        <div class="table-container flex-grow">
          <!-- Native Table Element -->
          <table class="table w-full">
            <thead>
              <tr>
                <th class="text-xs">Date</th>
                <th class="text-xs">De</th>
                <th class="text-xs">Libelle</th>
                <th class="text-xs">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y-2 divide-white text-black">
              {#each commandesNonTraitées as commande}
              {@const date = commande.date.toLocaleString().split(' ')}
    
                <tr on:click={()=>{dialog.showModal();selectedCommande=commande}} class="decoration-2 divide-x-2 {['child:bg-green-300','child:bg-orange-300','child:bg-red-300'][commande.statut + 1]}">
                  <td>{date[0]}<br>{date[1]}</td>
                  <td>{commande.from}</td>
                  <td><p class="text-wrap">{commande.libelle}</p></td>
                  <td>{getStatut(commande.statut)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </svelte:fragment>
    </AccordionItem>
    <!-- Statut 2 -->
    <AccordionItem class="{commandesEnCours.length>0?'bg-red-400':''}">
      <svelte:fragment slot="lead">
        <Icon icon="mdi:counterclockwise-arrows"/>
      </svelte:fragment>
		  <svelte:fragment slot="summary">
        <p class="text-xl">Commandes en cours - {commandesEnCours.length}</p>
      </svelte:fragment>
		  <svelte:fragment slot="content">
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
              <tbody class="divide-y-2 divide-white text-black">
                {#each commandesEnCours as commande}
                {@const date = commande.date.toLocaleString().split(' ')}
                  <tr on:click={()=>{dialog.showModal();selectedCommande=commande}} class="decoration-2 divide-x-2 {['child:bg-green-300','child:bg-orange-300','child:bg-red-300'][commande.statut + 1]}">
                    <td>{date[0]}<br>{date[1]}</td>
                    <td>{commande.from}</td>
                    <td><p class="text-wrap">{commande.libelle}</p></td>
                    <td>{getStatut(commande.statut)}</td>
                  </tr>
                  {/each}
              </tbody>
            </table>
          </div>
      </svelte:fragment>
    </AccordionItem>
    <AccordionItem>
      <svelte:fragment slot="lead">
        <Icon icon="mdi:check-decagram"/>
      </svelte:fragment>
		  <svelte:fragment slot="summary">
        <p class="text-xl">Commandes finies - {commandesFinies.length}</p>
      </svelte:fragment>
		  <svelte:fragment slot="content">
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
              <tbody class="divide-y-2 divide-white text-black">
                {#each commandesFinies as commande}
                {@const date = commande.date.toLocaleString().split(' ')}
                  <tr on:click={()=>{dialog.showModal();selectedCommande=commande}} class="decoration-2 divide-x-2 {['child:bg-green-300','child:bg-orange-300','child:bg-red-300'][commande.statut + 1]}">
                    <td>{date[0]}<br>{date[1]}</td>
                    <td>{commande.from}</td>
                    <td><p class="text-wrap">{commande.libelle}</p></td>
                    <td>{getStatut(commande.statut)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
      </svelte:fragment>
    </AccordionItem>
  </Accordion>
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
              <td><p class="text-wrap">{selectedCommande.libelle}</p></td>
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