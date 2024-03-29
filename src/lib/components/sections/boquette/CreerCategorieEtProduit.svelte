<script lang="ts">
    import { enhance } from "$app/forms";
    import SectionCard from "$lib/components/SectionCard.svelte";
    import MyButton from "$lib/components/miscellaneous/MyButton.svelte";
    import type { categories} from "@prisma/client";

    export let categories:categories[];
    export let id_boquette:number;

    const flexClass = "flex flex-col ";
</script>
<SectionCard title="Créer produit et catégorie">
  <form method="post" use:enhance action="/boquette-{id_boquette}?/create_category" class="flex flex-col gap-5 w-full">
    <div class="flex flex-col">
      <label class="font-zagoth text-white" for="nom_categorie">Nom catégorie</label>
      <input type="text" name="nom_categorie" id="nom_categorie" class="bg-red-100 text-black">
    </div>

    <MyButton value="Créer catégorie"/>
  </form>

  <form method="post" use:enhance action="/boquette-{id_boquette}?/create_product" class="flex flex-col gap-2">
    <label class={flexClass}>
      <p class="font-zagoth">Nom produit</p>
      <input type="text" name="nom_produit" class="bg-red-100 text-black">
    </label>

    <label class={flexClass}>
      <p class="font-zagoth">Prix produit</p>
      <input type="number" name="prix_produit" class="bg-red-100 text-black">
    </label>

    <label class={flexClass}>
      <p class="font-zagoth">Catégorie du produit</p>
      <select name="categorie_produit" class="bg-red-100 text-black">
        {#each categories as cat}
          <option value={cat.id_categorie}>{cat.nom}</option>
        {/each}
      </select>
    </label>

    <label class={flexClass}>
      <p class="font-zagoth">Stock (laisser vide pour ne pas activer la gestion de stock)</p>
      <input type="number" name="stock" class="bg-red-100 text-black">
    </label>
    <label class="font-zagoth text-white">
      <input type="checkbox" name="libre_service" id="libre_service" class="bg-red-100 text-black">
      Libre service (Si cette option est activée et que la partie PG de la boquette est activée alors les Pg pourront se rhopser directement depuis leur espace)
    </label>
    <MyButton value="Créer produit"/>
  </form>
</SectionCard>