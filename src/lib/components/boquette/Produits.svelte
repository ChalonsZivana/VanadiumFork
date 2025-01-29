<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import type { categories, produits } from "@prisma/client";
  import CustomTable from "../miscellaneous/CustomTable.svelte";
  import { enhance } from "$app/forms";
  import ValidationButton from "../miscellaneous/ValidationButton.svelte";
  import SubmitDialog from "../miscellaneous/SubmitDialog.svelte";

  export let id_boquette: number;
  export let categories: categories[];
  export let produits: produits[];
  export let editDialog: HTMLDialogElement;
  export let editable: boolean;

  $: inventaireActif =
    produits.map((e) => e.inventaire).some((e) => e != null) || editable;
  $: categories_id = categories.map((e) => e.id_categorie);

  function getProducts(id_categorie: number) {
    return produits
      .filter((e) => e.id_categorie == id_categorie)
      .sort((a, b) => a.nom.localeCompare(b.nom));
  }

  $: prodsByCategorie = categories
    .map((e) => ({
      categorie: e,
      products: getProducts(e.id_categorie),
    }))
    .concat([
      {
        categorie: {
          id_boquette: NaN,
          id_categorie: NaN,
          nom: "Sans categorie",
        },
        products: produits.filter(
          (e) => !categories_id.includes(e.id_categorie),
        ),
      },
    ]);

  function editProduct(product: (typeof produits)[0]) {
    productToEdit = product;
    editDialog.showModal();
  }

  function toggleAnimate(id_produit: number) {
    document
      .getElementById("produit-" + id_produit)
      ?.classList.toggle("animate-background-shine");
  }

  let productToEdit: (typeof produits)[0] | null = null;
  $: headers = ["Produit", "Prix"];
  $: {
    if (inventaireActif) {
      headers.push("Inventaire");
      headers = headers;
    }
  }
</script>

<SectionCard title="Produits">
  <div class="flex flex-col font-bold gap-2 w-full">
    {#each prodsByCategorie as prodcat}
      <p class="text-center text-3xl">
        {prodcat.categorie.nom != ""
          ? prodcat.categorie.nom
          : "catégorie sans nom"}
      </p>
      {#if prodcat.products.length == 0 && !isNaN(prodcat.categorie.id_categorie)}
        <form use:enhance method="post">
          <input
            type="hidden"
            name="id_categorie"
            value={prodcat.categorie.id_categorie}
          />
          <ValidationButton
            formaction="?/deleteCategory"
            text="Supprimer catégorie"
          />
        </form>
      {:else}
        <CustomTable elements={prodcat.products} {headers}>
          <svelte:fragment slot="tbody" let:e>
            <tr
              id="produit-{e.id_produit}"
              class="w-full"
              on:animationend={() => toggleAnimate(e.id_produit)}
            >
              <td class="h-10">
                <button
                  disabled={!editable}
                  class="w-full h-full"
                  on:click={() => editProduct(e)}>{e.nom}</button
                >
              </td>
              <td class="flex items-center h-10">
                <button
                  disabled={!editable}
                  class="w-full h-full"
                  on:click={() => editProduct(e)}
                >
                  {#if id_boquette == 7}
                    {e.prix}€ + {e.prix2}€ = {e.prix + e.prix2}€
                  {:else}
                    {e.prix}€
                  {/if}
                </button>
              </td>
              {#if inventaireActif}
                <td class="h-10">
                  <button
                    disabled={!editable}
                    class="w-full h-full"
                    on:click={() => editProduct(e)}>{e.inventaire}</button
                  >
                </td>
              {/if}
            </tr>
          </svelte:fragment>
        </CustomTable>
      {/if}
    {/each}
  </div>
</SectionCard>

<SubmitDialog
  customEnhance={() => {
    return ({ update }) => update({ reset: false });
  }}
  onsubmit={() => toggleAnimate(productToEdit?.id_produit ?? 0)}
  bind:dialog={editDialog}
  buttonText="Editer"
  formAction="?/editProduct"
  title="Edition Produit"
>
  {#key productToEdit}
    {#if productToEdit}
      <div class="flex flex-col h-96 justify-around">
        <input
          type="hidden"
          name="id_produit"
          value={productToEdit.id_produit}
        />
        <label>
          <p class="text-2xl font-zagoth ">Catégorie du produit:</p>
          <select
            class="h-10 w-full select"
            name="id_categorie"
            value={productToEdit.id_categorie}
          >
            {#each categories as cat}
              <option value={cat.id_categorie}>{cat.nom}</option>
            {/each}
          </select>
        </label>
        <label>
          <p class="text-2xl font-zagoth">Nom du produit:</p>
          <input
            class="pl-2 h-10 w-full input"
            type="text"
            name="nom"
            value={productToEdit.nom}
          />
        </label>
        <label>
          <p class="text-2xl font-zagoth ">Prix du produit:</p>
          <input
            class="pl-2 h-10 w-full input"
            type="number"
            step="0.001"
            min="0"
            name="prix"
            value={productToEdit.prix}
          />
        </label>
        {#if id_boquette == 7}
          <label>
            <p class="text-2xl font-zagoth ">Prix2 du produit:</p>
            <input
              class="pl-2 h-10 w-full input"
              type="number"
              step="0.001"
              min="0"
              name="prix2"
              value={productToEdit.prix2}
            />
          </label>
        {/if}
        <label>
          <p class="text-2xl font-zagoth text-white">Inventaire:</p>
          <input
            class="pl-2 h-10 w-full input"
            type="number"
            step="1"
            min="0"
            name="inventaire"
            value={productToEdit.inventaire}
          />
        </label>

        <ValidationButton
          formaction="?/deleteProduct"
          text="Supprimer produit"
        />
      </div>
    {/if}
  {/key}
</SubmitDialog>
