<script lang="ts">
    import { enhance } from "$app/forms";
  import { triggerPopupForm } from "$lib/stores/popupStore.js";
    import Icon from "@iconify/svelte";
    import { SlideToggle } from "@skeletonlabs/skeleton";

  export let data;
  export let form: { success: boolean; message: string }[];

  $: triggerPopupForm(form);

  let fromage:string;
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

    <section class="p-10 flex gap-2 w-80">
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

    <section class="p-10">
      <SlideToggle name="slide" bind:checked={végé}>Végé</SlideToggle>

      <div  class="flex gap-2 {végé ? 'scale-y-0' : 'scale-y-100'} duration-500">
        {#each data.saucissons as c}
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

    <section class="p-10">
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

  <form action="?/commanderCroute" use:enhance method="post">
    <input type="hidden" name="fromage" bind:value={fromage} />
    <input type="hidden" name="saucissons" bind:value={saucissonsJoined} />
    <input type="hidden" name="vege" bind:value={végé} />
    <input type="hidden" name="taille" bind:value={taille} />
    <button disabled={!commandeActive} class="btn variant-filled-primary">
      {#if !commandeActive}
        <Icon class="ml-5 text-2xl" icon="mdi:lock" />
      {/if}
      commander
    </button>
  </form>
</div>
