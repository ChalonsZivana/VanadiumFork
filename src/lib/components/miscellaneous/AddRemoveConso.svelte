<script lang="ts">
  import type { consommations, historique_fams } from "@prisma/client";

  export let cons:consommations|historique_fams;

  const fetchUrl = 'id_conso' in cons ? 'consommations' : 'historique_fams';
  
  function addConso(){
    fetch(`/api/${fetchUrl}`, {
      method:'POST',
      body:JSON.stringify({
        action:'uncancel',
        id:'id_conso' in cons ? cons.id_conso:cons.id_transaction,
      })
    });
    cons.annule = null;
  }

  function removeConso(){
    fetch(`/api/${fetchUrl}`, {
      method:'POST',
      body:JSON.stringify({
        action:'cancel',
        id:'id_conso' in cons ? cons.id_conso:cons.id_transaction,
      })
    });
    cons.annule = true;
  }
</script>



{#if cons.annule}
  <button on:click={addConso} class="p-1 rounded-lg w-12">
    <img src="/svgs/add-square.svg" alt="" srcset="">
  </button>
{:else}
  <button on:click={removeConso} class="p-1 rounded-lg w-12">
    <img src="/svgs/minus-square.svg" alt="" srcset="">
  </button>
{/if}
