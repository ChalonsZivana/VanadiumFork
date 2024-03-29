<script lang="ts">  
  import SectionCard from "$lib/components/SectionCard.svelte";
  import type {RhopseBoquette} from './+page.server';
  import RhopseComponent from "$lib/components/miscellaneous/RhopseComponent.svelte";

  export let data;
  export let dialog:HTMLDialogElement;
  let boquette:RhopseBoquette|null = null;
</script>


<div class="flex h-screen flex-col items-center gap-5">
  <div class="{(boquette!=null)?'h-10':'h-40'} duration-300"></div>
  
  <div class="w-5/6">
    <SectionCard title="Rhopses">
      <div class="p-3 rounded-md bg-amber-100">
        <p class="text-black">Tu peux te rhopser ici sur certains produits du Tabagn's !</p>
      </div>
      <div class="flex gap-5 flex-wrap justify-center text-white">
        {#each data.boquettesLibreService as boq}
        <button on:click={()=>boquette=boq} class="{boquette==boq ? 'bg-red-600':'bg-red-600'} p-2 rounded-md">{boq.boquette?.nom??'erreur'}</button>
        {/each}
      </div>
    </SectionCard>
  </div>
  {#if boquette}
    {#key boquette}
      <RhopseComponent 
      categories={boquette.categories} produits={boquette.products} pg={data.USER.pg} id_boquette={boquette.boquette.id_boquette} bind:dialog={dialog}
      />
    {/key}
  {/if}
  
  
</div>
