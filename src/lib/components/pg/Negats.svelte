<script lang='ts'>
  import SectionCard from "../SectionCard.svelte";

  export let negats:{[key: number]:number};
</script>

<SectionCard title="Negat's">
  <div class="w-full flex justify-around">
    {#each Object.entries(negats) as [title, solde]}
      <a href="/rechargement">
        <button class={`flex flex-col items-center mt-5 rounded-md p-1 w-28 text-white 
          ${(solde>=0)?"bg-red-600 hover:bg-red-400":"bg-red-600 hover:bg-red-400"}`}>
          <p class="font-bold">Prom's {title}</p><p>{solde}€</p>
        </button>
      </a>
    {/each}
  </div>
</SectionCard>

