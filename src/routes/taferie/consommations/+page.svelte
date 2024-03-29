<script lang="ts">
  import FullSearch from "$lib/components/search/FullSearch.svelte";

  export let data;
  export let form:{consommations:typeof data.consommations, page:number, totalCons:number};

  $: consomms =form ?  form.consommations : data.consommations;
  $: page = form ? form.page : 1;
  $: totalCons = form ? form.totalCons : data.totalCons;
  $: nombrePages =Math.ceil(totalCons / 100);
</script>

<div class="w-11/12 pt-5">
  <FullSearch 
    title="< Historique Général >" 
    totalCons={totalCons}
    nombrePages={nombrePages}
    consommations={consomms}
    page={page}
    types={
    {"PG → Boquette":"pg_boq", 
      "Boq → Ext":"ext_boq",
      "Fams → Ext":"ext_fams",
      "Pg → Ext":"pg_ext",
      "Pg → Pg":"pg_pg",
      "Pg → Fams":"pg_fams",
    }}/>
</div>