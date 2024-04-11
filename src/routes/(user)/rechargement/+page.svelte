<script lang="ts">
    import { enhance } from '$app/forms';
  import SectionCard from '$lib/components/SectionCard.svelte'
  import EuroBill from '$lib/components/svgs/euro-bill.svelte';
  import { onMount } from 'svelte';

  export let data;
  export let form;
  let dialog:HTMLDialogElement;

  const originDate = (data.date ?? new Date()).getTime();
  let timeout:number|null = null;
  onMount(()=>{
    if(form)dialog.show();

    if(data.verify){
      setInterval(()=>{        
        timeout = Math.floor(120 - (new Date().getTime() - originDate)/1000);
        if(timeout < 0) timeout = 0;
      },1000)
    }
  });
</script>


<div class="w-11/12 h-full mt-5 flex flex-col gap-5">
  {#if !data.verify}
    <SectionCard title="Rechargement Lydia">
      {#if data.lydiazocque.valeur == "0"}

        <form action="?/createLydiaDemand" method="post" class="flex flex-col gap-5">
          <p class="p-5 w-full rounded-md bg-red-100 text-yellow-900">
            Rentrez votre numéro de téléphone (associé à votre compte Lydia), si celui-ci n'est pas relié alors vous recevrez un SMS pour pouvoir payer en ligne. Sinon, acceptez le paiement sur la plateforme Lydia.
          </p>
          <div class="w-full text-xl gap-5 flex flex-col">
            <label class="w-full">
              Numéro de téléphone Lydia:
              <input class="w-full text-black" type="tel" name="tel" value="0768969314">
            </label>
            <label class="w-full">
              Montant (minimum 15€):
              <input class="w-full text-black" type="number" name="montant">
            </label>
          </div>

          <div class="flex justify-center w-full">
            <button class="bg-blue-500 w-1/2 flex justify-center rounded-md">
              <EuroBill className="w-14 p-1"/>
            </button>
          </div>
        </form>
      {:else}
        <p>Les rechargements Lydia sont zocqués.</p>
      {/if}
    </SectionCard>
  
  
  {:else}
      <SectionCard title="Vérification Rechargement">
        <div class="flex flex-col gap-10">
          <p class="text-white text-xl text-center">Une demande de rechargement a été effectuée, appuyez sur le bouton.</p>
          <div class="w-full flex flex-col gap-5 items-center">
            <p class="text-xl">Temps restant: <span class="font-bold">
              {#if timeout != null}
                {timeout}
              {/if}
            </span></p>
            <form action="?/verifyLydiaDemand" method="post">
              <button class="p-2 bg-green-600 text-xl">Vérifier le rechargement</button>
            </form>
          </div>
        </div>
      </SectionCard>
  {/if}

  <SectionCard title="Rechargement Fam's">
    <form use:enhance action="?/rechargementFams" method="post" class="flex w-full flex-col gap-5">
      <label class="w-full text-xl">
        Montant:
        <input class="w-full text-black" type="number" step="0.01" min="0" max={data.USER.pg.solde} name="montant" placeholder="À partir de ton compte.">
      </label>
      <label class="w-full text-xl">
        Libelle:
        <input class="w-full text-black" type="text" name="libelle">
      </label>
      <div class="flex justify-center w-full">
        <button class="bg-blue-500 w-1/2 flex justify-center rounded-md">
          <EuroBill className="w-14 p-1"/>
        </button>
      </div>
    </form>
  </SectionCard>
</div>


<dialog bind:this={dialog} 
  on:animationend={()=>dialog.close()}
class="fixed w-11/12 bottom-14 p-3 overflow-clip rounded-xl open:animate-fade-in">
  {#if form?.ok}
    <p class="text-green-500 text-xl p-1 bg-white">
      {form.ok}
    </p>
  {:else}
    <p class="text-red-500 text-xl p-1 bg-white">
      {#if form?.error}
       {form.error}
      {/if}
    </p>
  {/if}
</dialog>