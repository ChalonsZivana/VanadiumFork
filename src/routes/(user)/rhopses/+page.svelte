<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";

  export let data;
</script>

<div class="flex justify-center mt-20 w-full p-2">
  {#if data.USER.pg.can_buy}
    <SectionCard title="Rhopses">
      <div class="p-3 rounded-md bg-amber-100">
        <p class="text-black">
          Tu peux te rhopser ici sur certains produits du Tabagn's !
        </p>
      </div>
      <div class="flex gap-5 flex-wrap justify-center text-white">
        {#each data.boquettes as boq}
          <button class="bg-red-600 p-2 rounded-md">
            <a href="/rhopses/rhopse-{boq.id_boquette}">{boq.nom ?? "erreur"}</a
            >
          </button>
        {/each}
      </div>
    </SectionCard>
  {:else}
    <SectionCard title="Rhopses">
      <div class="p-3 rounded-md variant-filled-warning">
        <p class="text-black text-center">
          Tu es trop en negats ou depuis trop longtemps.
        </p>
      </div>
    </SectionCard>
  {/if}
</div>
