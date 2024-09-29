<script lang="ts">
  import FullSearch from "$lib/components/search/consommations/FullSearch.svelte";
  import type { consommationsSearch } from "$lib/components/search/consommations/fullsearch";

  export let form:{search:Awaited<ReturnType<typeof consommationsSearch>>};

  let currData:typeof form.search | null;
  $:currData = form ? form.search: null;  
  $: nombrePages = currData ? Math.ceil(currData.totalCons / 20) : undefined;

</script>

<div class="w-11/12 pt-5">
  {#await currData?.consommations}
    Chargement Historique Général
  {:then consos} 
  <FullSearch 
  fromOption={true}
  title="< Historique Général >" 
  cancelOption={true}
  totalCons={currData?.totalCons ?? undefined}
  nombrePages={nombrePages}
  consommations={consos}
  page={form?.search.page}
  types={
    {"PG → Boquette":"pg_boq", 
    "EXT → Boq":"ext_boq",
    "EXT → Fams":"ext_fams",
    "EXT → Pg":"pg_ext",
    "Pg → Pg":"pg_pg",
    "Pg → Fams":"pg_fams",
    }
  }/>
  {/await}
</div>