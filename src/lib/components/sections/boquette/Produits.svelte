<script lang="ts">
  import SectionCard from "$lib/components/section_card.svelte";
  import MyButton from "$lib/components/utils/MyButton.svelte";
    import type { categories, produits } from "@prisma/client";

  export let categories:categories[];
  export let produits:produits[];

  function getProducts(id_categorie:number){
    return produits.filter(e=>e.id_categorie==id_categorie);
  }
</script>

<SectionCard title="Produits">
  <div class="flex flex-col font-bold gap-2">
    {#each categories as categorie}
      <p class="text-2xl">{categorie.nom}</p>
      <div class="flex flex-col overflow-clip gap-[0.5px] bg-slate-300 rounded-md">
        {#each getProducts(categorie.id_categorie) as product, i}
          <div class="bg-white text-black p-1">
            {product.nom}     ({product.prix}€)
          </div>
        {/each}
      </div>
    {/each}
  </div>
  
</SectionCard>