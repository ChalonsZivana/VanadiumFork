<script lang="ts">
    import SectionCard from "$lib/components/SectionCard.svelte";
    import MyButton from "$lib/components/miscellaneous/MyButton.svelte";
    import {onMount} from 'svelte'
    import { enhance } from '$app/forms';
    export let form;
    let dialog:HTMLDialogElement;
    onMount(()=>{
      if(form){
        dialog.show();
      }
    })     
</script>


<div class="w-11/12 self-center">
  <form method="post" use:enhance name="login" action="/tafferie/inscription?/inscription" class="flex flex-col gap-10">
    <SectionCard title="Inscriptions">
      <label class="w-11/12">
        <p class="font-zagoth text-white text-xl">Adresse mail :</p>
        <input type="email" name="email" class="w-full rounded-md p-1">
        
      </label>
      <label class="w-11/12">
        <p class="font-zagoth text-white">Nums :</p>
        <input type="number" name="nums" class="w-full rounded-md p-1">
      </label>
      <label class="w-11/12">
        <p class="font-zagoth text-white">Proms :</p>
        <input type="number" name="proms" class="w-full rounded-md p-1">
      </label>
      <label class="w-11/12">
        <p class="font-zagoth text-white">Montant sur le compte :</p>
        <input type="number" name="solde" class="w-full rounded-md p-1">
      </label>
      <label class="w-11/12">
        <p class="font-zagoth text-white">Prénom :</p>
        <input type="text" name="prenom" class="w-full rounded-md p-1">
      </label>
      <label class="w-11/12">
        <p class="font-zagoth text-white">Nom :</p>
        <input type="text" name="nom" class="w-full rounded-md p-1">
      </label>
      
      <MyButton value="Créer le compte" callback={()=>dialog.show()}/>
    </SectionCard>
  </form>
</div>

<dialog bind:this={dialog} 
  on:introstart={()=>console.log('hey')}
  on:animationend={()=>dialog.close()}
class="fixed bottom-14 p-3 overflow-clip rounded-xl open:animate-fade-in">
  {#if form?.success}
    <p class="text-green-500 text-xl p-1 bg-white">
      Le PG a été créé.
    </p>
  {:else}
    <p class="text-red-500 text-xl p-1 bg-white">
      {#if form?.missing}
      Tous les champs sont obligatoires
      {:else if form?.["already exists"]}
      Ce PG existes déja
      {/if}
    </p>
  {/if}
</dialog>