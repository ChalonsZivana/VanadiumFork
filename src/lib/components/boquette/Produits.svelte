<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import type { categories, produits } from "@prisma/client";
  import CustomTable from "../miscellaneous/CustomTable.svelte";
  
  export let categories:categories[];
  export let produits:produits[];

  function getProducts(id_categorie:number){
    return produits.filter(e=>e.id_categorie==id_categorie);
  }
</script>

<SectionCard title="Produits">
  <div class="flex flex-col font-bold gap-2 w-full">
    {#each categories as categorie}
        <CustomTable title={categorie.nom} elements={getProducts(categorie.id_categorie)} headers={['Produit','Prix']}>
          <svelte:fragment slot="tbody" let:e>
            <tr>
              <td>{e.nom}</td>
              <td>{e.prix}€</td>
            </tr>
          </svelte:fragment>
        </CustomTable>
    {/each}
  </div>
</SectionCard>