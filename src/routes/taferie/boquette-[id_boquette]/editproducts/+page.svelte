<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import { enhance } from "$app/forms";
  import Produits from "$lib/components/boquette/Produits.svelte";
  import Icon from "@iconify/svelte";

  export let data;
  export let editDialog: HTMLDialogElement;

  let id_categorie: null | number = null;
</script>

<div class="w-11/12 mt-5 flex flex-col gap-5">
  <SectionCard title="Ajouter Produit">
    <form
      class="w-full flex flex-col gap-5"
      use:enhance
      action="?/addProduct"
      method="post"
    >
      <label>
        <p class="text-3xl font-zagoth">Nom</p>
        <input
          required
          class="w-full text-xl pl-2 h-10 text-black"
          type="text"
          name="nom"
          id=""
        />
      </label>
      <label class="flex flex-col gap-2">
        <p class="text-3xl font-zagoth">Catégorie</p>
        <select
          class="w-full h-10 text-black"
          name="id_categorie"
          bind:value={id_categorie}
        >
          <option value={null}>Nouvelle catégorie</option>
          {#each data.categories as cat}
            <option value={cat.id_categorie}>{cat.nom}</option>
          {/each}
        </select>
        {#if id_categorie == null}
          <input
            required
            class="text-black text-xl pl-2 w-full h-10"
            type="text"
            name="nom_categorie"
            placeholder="nouvelle catégorie"
            id=""
          />
        {/if}
      </label>
      <label>
        <p class="text-3xl font-zagoth">Prix</p>
        <input
          required
          class="w-full text-xl pl-2 h-10 text-black"
          type="number"
          step="0.001"
          min="0"
          name="prix"
        />
      </label>
      {#if data.boquette.id_boquette == 7}
        <label>
          <p class="text-3xl font-zagoth">Prix2</p>
          <input
            required
            class="w-full text-xl pl-2 h-10 text-black"
            type="number"
            step="0.001"
            min="0"
            name="prix2"
          />
        </label>
      {/if}
      <button class="self-center">
        <Icon icon="mdi:edit" />
      </button>
    </form>
  </SectionCard>

  <Produits
    id_boquette={data.boquette.id_boquette}
    categories={data.categories}
    produits={data.produits}
    editable={true}
    {editDialog}
  />
</div>
