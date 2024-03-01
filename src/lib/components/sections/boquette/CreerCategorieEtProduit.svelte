<script lang="ts">
    import SectionCard from "$lib/components/section_card.svelte";
    import MyButton from "$lib/components/utils/MyButton.svelte";
    import type { categories} from "@prisma/client";

    export let categories:categories[];
    console.log(categories)
    const flexClass = "flex flex-col ";
</script>
<SectionCard title="Créer produit et catégorie">
  <form method="post" action="?/create_category" class="flex flex-col gap-5 w-full">
    <div class="flex flex-col">
      <label class="font-zagoth" for="nom_categorie">Nom catégorie</label>
      <input class="text-black" type="text" name="nom_categorie" id="nom_categorie">
    </div>

    <MyButton value="Créer catégorie"/>
  </form>

  <form method="post" action="?/create_product" class="flex flex-col gap-2">
    <div class={flexClass}>
      <label class="font-zagoth" for="nom_produit">Nom produit</label>
      <input class="text-black"  type="text" name="nom_produit" id="nom_produit">
    </div>

    <div class={flexClass}>
      <label class="font-zagoth" for="prix_produit">Prix produit</label>
      <input class="text-black"  type="text" name="prix_produit" id="prix_produit">
    </div>

    <div class={flexClass}>
      <label class="font-zagoth" for="categorie_produit">Catégorie du produit</label>
      <select class="text-black" id="categorie_produit">
        {#each categories as cat}
          <option value={cat.id_categorie}>{cat.nom}</option>
        {/each}
      </select>
    </div>

    <div class={flexClass}>
      <label class="font-zagoth" for="stock">Stock (laisser vide pour ne pas activer la gestion de stock)</label>
      <input class="text-black"  type="text" name="stock" id="stock">
    </div>
    <label class="font-zagoth">
      <input type="checkbox" name="libre_service" id="libre_service">
      Libre service (Si cette option est activée et que la partie PG de la boquette est activée alors les Pg pourront se rhopser directement depuis leur espace)
    </label>
    <MyButton value="Créer produit"/>

  </form>
</SectionCard>