<script lang="ts">
  import type {boquettes, categories, pg, produits} from '@prisma/client';
  import { exporterProduits, generateExcel} from "$lib/components/boquette/ExportImportFeuilleRhopses";
  import Icon from "@iconify/svelte";
  import ImportFeuilleRhopses from "$lib/components/boquette/ImportFeuilleRhopses.svelte";
  
  export let boquette:boquettes;
  export let produits:produits[];
  export let categories:categories[];
  export let pgs:Partial<pg>[]|null;
</script>


<div class="btn-group self-center w-fit variant-filled-secondary divide-gray-400">
  <button on:click={()=>generateExcel(produits)}>
    <Icon icon="fluent-mdl2:generate"/>
  </button>
  {#if pgs != null}
    <ImportFeuilleRhopses id_boquette={boquette.id_boquette} {pgs}/>
  {/if}
  <button on:click={()=>exporterProduits(boquette, produits, categories)}>
    <Icon icon="mdi:export-variant"/>
  </button>
  {#if boquette.nom == "K've" || boquette.nom == "Auberge"}
    <a href="/boquette-{boquette.id_boquette}/editproducts">
      <Icon icon="mdi:edit"/>
    </a>
  {/if}
  <a href="/boquette-{boquette.id_boquette}/consommations">
    <Icon icon="mdi:event-note"/>
  </a>
  <slot/>
</div>

