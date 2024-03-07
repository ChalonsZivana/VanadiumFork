<script lang="ts">
  import type { SessionData } from "$lib/server/auth";

  export let session:SessionData;
  export let id_boquette:number | null;  
</script>

{#if session.boquettes}
<div class="h-10 p-2 bg-red-950 text-white flex justify-center items-center gap-5">
  {#each session.boquettes as boq}
    {#if boq.nom=="TAFerie"}
      <a class="{boq.id_boquette==id_boquette?'bg-green-700':'bg-red-700'} rounded-xl p-1" href={"/tafferie"}>{boq.nom}</a>
    {:else}
      <a class="{boq.id_boquette==id_boquette?'bg-green-700':'bg-red-700'} rounded-xl p-1" href={`/boquette-${boq.id_boquette}`}>{boq.nom}</a>
    {/if}
  {/each}
  <a href="/login">
    <div class="p-1 bg-red-700 rounded-full flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
    </div>
  </a>
</div>
{/if}