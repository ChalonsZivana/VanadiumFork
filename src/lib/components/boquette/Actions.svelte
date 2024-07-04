<script lang="ts">
  import type {boquettes, categories, pg, produits} from '@prisma/client';
  import ToggleSectionCard from '../ToggleSectionCard.svelte';
  import ExportFeuilleRhopses from './ExportFeuilleRhopses.svelte';
  import ImportFeuilleRhopses from './ImportFeuilleRhopses.svelte';
  import ExporterProduits from './ExporterProduits.svelte';

  export let boquette:boquettes;
  export let products:produits[];
  export let categories:categories[];
  export let pgs:Partial<pg>[] | null;
</script>


<ToggleSectionCard title="Actions" toggleClass="h-48">
  <div class="flex flex-col gap-2 h-46 mt-5">
    <div class="flex flex-wrap justify-around gap-5 h-full text-white">  

      <ExportFeuilleRhopses {products}/>
      {#if pgs}
      <ImportFeuilleRhopses {pgs} id_boquette={boquette.id_boquette}/>
      {/if}
      <ExporterProduits {boquette} {categories} {products}/>
      <button class="bg-blue-600 p-2 relative flex justify-center items-center w-2/5 rounded-md">
        <a href="/boquette-{boquette.id_boquette}/consommations">consommations</a>
      </button>

      <slot/>
    </div>
  </div>
</ToggleSectionCard>

