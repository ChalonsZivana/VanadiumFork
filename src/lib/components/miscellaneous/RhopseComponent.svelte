<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import SubmitDialog from "$lib/components/miscellaneous/SubmitDialog.svelte";
  import MyButton from "$lib/components/miscellaneous/MyButton.svelte";
  import type { categories, pg, produits } from "@prisma/client";
  import type { SubmitFunction } from "@sveltejs/kit";
  import Icon from "@iconify/svelte";

  export let rhopseUrl: string;
  export let pg: Partial<pg>;
  export let produits: produits[];
  export let categories: categories[];

  export let dialog: HTMLDialogElement;

  const quantités = Object.fromEntries(produits.map((e) => [e.id_produit, 0]));
  let categorie = categories[3];
  $: products = categorie ? getProducts(categorie.id_categorie) : [];
  $: selectedProducts = produits.filter((e) => quantités[e.id_produit] > 0);

  function getProducts(id_categorie: number) {
    return produits.filter((e) => e.id_categorie == id_categorie);
  }
  function verifyPositivity(id_produit: number) {
    if (quantités[id_produit] < 0) quantités[id_produit] = 0;
  }
  function increment(id_produit: number, qt: number) {
    quantités[id_produit] += qt;
    verifyPositivity(id_produit);
  }
  const customEnhance: SubmitFunction<
    Record<string, unknown> | undefined,
    Record<string, unknown> | undefined
  > = ({ formData }) => {
    formData.set(
      "produits",
      JSON.stringify(
        selectedProducts.map((e) => [e.id_produit, quantités[e.id_produit]]),
      ),
    );
    for (let i of Object.keys(quantités)) {
      quantités[i] = 0;
    }
  };
</script>

<div class="h-full w-full flex flex-col card">
  <h1 class="card-header text-center h1 font-zagoth">
    Rhopse - {pg.nums}Ch{pg.proms}
  </h1>
  {#if selectedProducts.length}
    <section class="w-full flex flex-col gap-2 text-black p-5">
      <div class="flex flex-col gap-1 variant-filled-surface rounded-xl">
        {#each selectedProducts as product, i}
          <div class="animate-scale-up p-1 rounded-3xl overflow-clip">
            <p class="text-center font-bold">
              {product.nom} ({product.prix + product.prix2}€)
            </p>
            <div class="flex justify-center gap-1">
              <button
                on:click={() => increment(product.id_produit, -1)}
                class="w-10"
              >
                <Icon class="text-4xl" icon="mdi:minus-box" />
              </button>
              <input
                required
                on:change={() => verifyPositivity(product.id_produit)}
                class="input text-center rounded-lg w-20"
                type="number"
                min="0"
                bind:value={quantités[product.id_produit]}
              />
              <button
                on:click={() => increment(product.id_produit, 1)}
                class="w-10"
              >
                <Icon class="text-4xl" icon="mdi:add-box" />
              </button>
            </div>
          </div>
        {/each}
      </div>
      <div class="flex justify-center">
        <button class="btn variant-filled-primary" on:click={dialog.showModal}
          >RHOPSER</button
        >
      </div>
    </section>
  {/if}
  {#if categories.length > 1}
    <div class="p-5">
      <select
        class="text-black select variant-filled-secondary"
        bind:value={categorie}
      >
        {#each categories as cat}
          <option class="text-xs w-1/2" value={cat}>{cat.nom}</option>
        {/each}
      </select>
    </div>
  {/if}
  <section class="p-5 flex-grow flex flex-col min-h-0">
    <div
      class="overflow-y-auto text-black w-full flex flex-col variant-filled-surface"
    >
      {#if products.length}
        {#each products as product, i}
          <div>
            <p class="p-1 text-center font-bold">
              {product.nom} ({product.prix + product.prix2}€)
            </p>
            <div class="flex justify-center gap-1">
              <button
                on:click={() => increment(product.id_produit, -1)}
                class="w-10"
              >
                <Icon class="text-4xl" icon="mdi:minus-box" />
              </button>
              <input
                required
                on:change={() => verifyPositivity(product.id_produit)}
                class="input text-center w-20"
                type="number"
                min="0"
                bind:value={quantités[product.id_produit]}
              />
              <button
                on:click={() => increment(product.id_produit, 1)}
                class="w-10"
              >
                <Icon class="text-4xl" icon="mdi:add-box" />
              </button>
            </div>
          </div>
        {/each}
      {:else}
        <p class="text-center">Aucun produit dans cette catégorie</p>
      {/if}
    </div>
  </section>
</div>

<SubmitDialog
  {customEnhance}
  bind:dialog
  formAction={rhopseUrl}
  title="< Rhopser >"
  buttonText="Rhopser"
>
  <p class="font-zagoth text-3xl text-center text-white">
    {pg.nums}Ch{pg.proms}
  </p>

  <div class="rounded-3xl overflow-clip mt-5">
    {#each selectedProducts as product, i}
      <div class="animate-scale-up divide-y-2 divide-black">
        <div>
          <p class="bg-gray-300 text-center font-bold">
            {product.nom} ({product.prix + product.prix2}€)
          </p>
          <div class="flex bg-slate-200 justify-center gap-1">
            {quantités[product.id_produit]}
          </div>
        </div>
      </div>
    {/each}
  </div>
</SubmitDialog>
