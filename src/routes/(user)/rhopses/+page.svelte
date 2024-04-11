<script lang="ts">  
  import SectionCard from "$lib/components/SectionCard.svelte";
  import type { boquettes } from "@prisma/client";

  export let data;
</script>


<div class="flex mt-20 w-11/12">  
  <SectionCard title="Rhopses">
    <div class="p-3 rounded-md bg-amber-100">
      <p class="text-black">Tu peux te rhopser ici sur certains produits du Tabagn's !</p>
    </div>
    <div class="flex gap-5 flex-wrap justify-center text-white">
      {#each data.boquettes as boq}
      <button class="bg-red-600 p-2 rounded-md">
        <a href="/rhopses/rhopse-{boq.id_boquette}">{boq.nom??'erreur'}</a>
      </button>
      {/each}
    </div>
  </SectionCard>
</div>
