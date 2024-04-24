<script lang="ts">
  import FullSearch from "$lib/components/search/FullSearch.svelte";

  export let data;
  export let form:{search:typeof data.search};

  let currData:typeof data.search;
  $:currData = form ? form.search : data.search;  
  $: nombrePages = Math.ceil(currData.totalCons / 100);

</script>

<div class="w-11/12 pt-5">
    {#await currData.consommations}
  Chargement Historique Général
    {:then consommations} 
      <FullSearch 
      title="< Historique Général >" 
      cancelOption={true}
      totalCons={currData.totalCons}
      nombrePages={nombrePages}
      consommations={consommations}
      page={currData.page}
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