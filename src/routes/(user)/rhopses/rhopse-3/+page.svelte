<script lang="ts">
    import { triggerPopupForm } from "$lib/stores/popupStore.js";
    import { oneShotEnhance } from "$lib/utils.js";
    import Icon from "@iconify/svelte";
    import { SlideToggle } from "@skeletonlabs/skeleton";

  export let data;
  export let form: { success: boolean; message: string }[];

  $: triggerPopupForm(form);

  let fromage:string | undefined;
  let saucissons:string[] = [];
  let taille = 'croüte';
  let végé: boolean = false;

  $:saucissonsJoined = saucissons.join('>');

  $:commandeActive = fromage!==undefined && (saucissons.length ||végé);
</script>

<div class="flex flex-col h-full w-11/12 place-items-center place-content-around">
  <p class="h1 font-zagoth">Commande de Croüte</p>
  <div class="card variant-filled-surface">
    <div class="card-header">
      <p class="h2 text-center">Fromage</p>
    </div>

    <section class="p-4 flex gap-2 w-80">
      {#each data.fromages as c}
        <button
          class="chip {fromage === c ? 'variant-filled-primary' : 'variant-filled-secondary'}"
          on:click={() => { fromage = c; }}
          on:keypress
        >
          {#if fromage === c}<span><Icon icon="mdi:tick"/></span>{/if}
          <span>{c}</span>
        </button>
      {/each}
    </section>
  </div>

  <div class="card variant-filled-surface w-80">
    <div class="card-header">
      <p class="h2 text-center">Saucisson</p>
      <p class="h4 text-center">
        (par ordre de préférence, pur porc par défaut)
      </p>
    </div>

    <section class="p-4">
      <SlideToggle name="slide" bind:checked={végé}>Végé</SlideToggle>

      <fieldset>

      </fieldset>
      <div  class="flex flex-wrap gap-2 {végé ? 'hidden' : ''} duration-500">
        {#each data.saucissons.filter(e=>!e.startsWith('halal')) as c}
          <button
            class="chip {saucissons.includes(c) ? 'variant-filled-primary' : 'variant-filled-secondary'}"
            on:click={() => { 
              if(saucissons.includes(c)) saucissons = saucissons.filter(s => s !== c);
              else saucissons = [...saucissons, c]; 
            }}
            on:keypress
          >
            {#if saucissons.includes(c)}<span>{saucissons.indexOf(c)+1}</span>{/if}
            <span>{c}</span>
          </button>
        {/each}
      </div>
    </section>
  </div>

  <div class="card variant-filled-surface w-80">
    <div class="card-header">
      <p class="h2 text-center">Taille</p>
    </div>

    <section class="p-4">
      <div  class="flex gap-2">
        {#each data.tailles as c}
          <button
            class="chip {taille === c ? 'variant-filled-primary' : 'variant-filled-secondary'}"
            on:click={() => { taille = c; }}
            on:keypress
          >
            {#if taille === c}<span><Icon icon="mdi:tick"/></span>{/if}
            <span>{c}</span>
          </button>
        {/each}
      </div>
    </section>
  </div>

  <form use:oneShotEnhance={({formElement, formData})=>{
    formData.set('fromage', fromage??'');
    formData.set('saucissons', saucissonsJoined);
    formData.set('vege', végé.toString());
    formData.set('taille', taille);

    saucissons = [];
    fromage = undefined;
    végé = false;
    taille = 'croüte';
    return ({})=>{}
  }} action="?/commanderCroute" method="post">
    <button disabled={!commandeActive} class="btn variant-filled-primary">
      {#if !commandeActive}
        <Icon class="ml-5 text-2xl" icon="mdi:lock" />
      {/if}
      commander
    </button>
  </form>
</div>
