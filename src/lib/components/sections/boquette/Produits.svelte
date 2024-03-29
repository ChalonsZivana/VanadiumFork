<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
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
        <p class="text-2xl text-white">{categorie.nom}</p>
        <div class="flex flex-col overflow-clip gap-[0.5px] bg-red-100 rounded-md text-black">
          {#each getProducts(categorie.id_categorie) as product}
            <div class="p-1">
              {product.nom}     ({product.prix}€)
            </div>
          {/each}
        </div>
    {/each}
  </div>
</SectionCard>