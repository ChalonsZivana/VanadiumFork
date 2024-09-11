<script lang="ts">
  import FullSearch from "$lib/components/search/consommations/FullSearch.svelte";
  import type { consommationsSearch } from "$lib/components/search/consommations/fullsearch";

  export let form:{search:Awaited<ReturnType<typeof consommationsSearch>>} | undefined;
</script>

<div class="w-11/12 pt-5">
  {#if form}
    <FullSearch 
    fromOption={true}
    title="< Historique Général >" 
    cancelOption={true}
    totalCons={form.search.totalCons}
    nombrePages={Math.ceil(form.search.totalCons / 20)}
    consommations={form.search.consommations}
    page={form.search.page}
    types={
      {"PG → Boquette":"pg_boq", 
      "EXT → Boq":"ext_boq",
      "EXT → Fams":"ext_fams",
      "EXT → Pg":"pg_ext",
      "Pg → Pg":"pg_pg",
      "Pg → Fams":"pg_fams",
      }
    }/>
  {:else}
  <FullSearch 
    title="< Historique Général >" 
    fromOption={true}
    cancelOption={true}
    types={
      {"PG → Boquette":"pg_boq", 
      "EXT → Boq":"ext_boq",
      "EXT → Fams":"ext_fams",
      "EXT → Pg":"pg_ext",
      "Pg → Pg":"pg_pg",
      "Pg → Fams":"pg_fams",
      }
    }/>
  {/if}
  
</div>