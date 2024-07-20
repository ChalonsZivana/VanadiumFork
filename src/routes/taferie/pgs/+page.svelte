<script lang="ts">
  import FullSearch from "$lib/components/search/pgs/FullSearch.svelte";

  export let data;
  export let form:{search:typeof data.search};

  let currData:typeof data.search;
  $: nombrePages = Math.ceil(currData.totalPgs / 20);
  $:currData = form ? form.search : data.search;  
</script>

<div class="w-11/12 pt-5">
    {#await currData.pgs}
  Chargement PGs
    {:then pgs} 
      <FullSearch 
      title="< PGs >"       
      pgs={pgs}
      totalPgs={currData.totalPgs}
      {nombrePages}
      page={currData.page}/>
    {/await}
</div>