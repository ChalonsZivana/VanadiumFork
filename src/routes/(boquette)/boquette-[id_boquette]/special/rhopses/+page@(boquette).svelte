<script lang="ts">
  import MyButton from "$lib/components/miscellaneous/MyButton.svelte";
  import type { categories, produits } from "@prisma/client";
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";
  import { triggerPopupForm } from "$lib/stores/popupStore.js";

  export let data;
  export let form: { success: boolean; message: string };

  let proms: number | null = null;
  const listProms = Object.keys(data.proms)
    .map((e) => parseInt(e))
    .sort((a, b) => a - b);
  $: boquette =
    data.BOQUETTES.find((e) => e.id_boquette == data.id_boquette) ??
    data.BOQUETTES[0];

  let pg: { nums: number; id_pg: number; anciens_autorises: string[] } | null =
    null;
  const listNums = () =>
    data.proms[proms as keyof typeof data.proms].sort(
      (a, b) => a.nums - b.nums,
    );
  let categorie: categories | null;
  $: categorie = null;
  let product: produits | null = null;
  $: getProducts = data.products.filter(
    (e) => e.id_categorie == categorie?.id_categorie,
  );
  let rhopse_ancien: string | null = null;

  const reset = () => {
    pg = null;
    proms = null;
    product = null;
    (categorie = null), (isLoading = false);
  };
  const buttonClass = "bg-white h-14 text-black w-80 rounded-md";
  const choicesContainerClass =
    "mt-5 flex-grow w-full flex flex-col justify-center items-center gap-1";
  const coloredClass = "p-3 bg-fuchsia-500 text-4xl rounded-md";

  let isLoading = false;

  $: triggerPopupForm(form);
</script>

<a
  href={data.USER?.pg.proms == 223 ? `/boquette-${data.id_boquette}` : "/"}
  class="absolute top-3 left-3 w-8"
>
  <Icon icon="mdi:house" class="w-8 h-8" />
</a>

<div class="h-full w-full flex flex-col items-center p-1 text-white">
  <div class=" flex justify-center items-center">
    <p class="text-5xl font-zagoth mt-5">Rhopse {boquette.nom}</p>
  </div>

  {#if proms == undefined}
    <p class="text-3xl font-zagoth mt-5">Choix Prom's</p>
    <div class="mt-5 flex-grow w-full flex justify-around items-center">
      {#each listProms as p}
        <button
          on:click={() => (proms = p)}
          class="h-28 aspect-square rounded-md bg-red-700">{p}</button
        >
      {/each}
    </div>
  {/if}

  {#if proms && pg == undefined}
    <!-- <p class="text-3xl font-zagoth mt-5">Choix Num's</p> -->
    <div class="mt-5 flex-grow w-full grid gap-1 grid-cols-10 grid-rows-[15]">
      {#each listNums() as n}
        {#if n.can_buy}
          <button
            on:click={() => (pg = n)}
            class="aspect-square rounded-md bg-red-700">{n.nums}</button
          >
        {:else}
          <div
            class="aspect-square rounded-md bg-gray-700 flex justify-center items-center"
          >
            {n.nums}
          </div>
        {/if}
      {/each}
    </div>
  {/if}

  {#if proms && pg && categorie == null}
    <p class="text-3xl font-zagoth mt-5">Choix Categorie</p>
    <div class={choicesContainerClass}>
      {#each data.categories as cat}
        <button class={buttonClass} on:click={() => (categorie = cat)}>
          {cat.nom}
        </button>
      {/each}
    </div>
  {/if}

  {#if proms && pg && categorie && product == null}
    <p class="text-3xl font-zagoth mt-5">Choix Boisson</p>
    <div class={choicesContainerClass}>
      {#each getProducts as prod}
        <button class={buttonClass} on:click={() => (product = prod)}>
          {prod.nom}
        </button>
      {/each}
    </div>
  {/if}

  <form
    use:enhance={({ formData }) => {
      formData.set("produits", JSON.stringify([[product?.id_produit, 1]]));
      return async ({ update }) => {
        reset();
        await update();
      };
    }}
    on:submit={() => (isLoading = true)}
    method="post"
    action={`?/rhopse`}
  >
    <!-- Validation -->
    {#if product}
      <div hidden={product == null} class={choicesContainerClass}>
        <div class="text-4xl flex flex-col justify-center items-center gap-5">
          <p>Veux-tu rhopser</p>
          <div class="flex justify-center items-center text-3xl">
            {#key proms}
              <select bind:value={pg} class={coloredClass}>
                {#each listNums() as n}
                  <option value={n}>{n.nums}</option>
                {/each}
              </select>
            {/key}
            <p class="mr-2 ml-2">ch</p>
            <select bind:value={proms} class={coloredClass}>
              {#each listProms as n}
                <option value={n}>{n}</option>
              {/each}
            </select>
          </div>
          <p>pour un</p>
          <select bind:value={product} class="{coloredClass} w-80 text-center">
            {#each getProducts as n}
              <option value={n}>{n.nom}</option>
            {/each}
          </select>
          de la catégorie
          <select
            bind:value={categorie}
            class="{coloredClass} w-80 text-center"
          >
            {#each data.categories as n}
              <option value={n}>{n.nom}</option>
            {/each}
          </select>
          <select
            bind:value={rhopse_ancien}
            name="rhopse_ancien"
            class="{coloredClass} w-80 text-center"
          >
            {#if pg != null}
              {#each pg.anciens_autorises as n}
                <option value={n}>{n}</option>
              {/each}
            {/if}
          </select>
          <MyButton bind:isLoading value="RHOPSER"></MyButton>
        </div>
      </div>
    {/if}

    <button type="button" class="w-14 mb-10" on:click={reset}>
      <Icon class="text-6xl" icon="mdi:circle-arrows" />
    </button>
  </form>
</div>
