<script lang="ts">
    import type { consommations_type } from "@prisma/client";
    import SectionCard from "../../SectionCard.svelte";
    import SquareRightArrow from "../../svgs/square-right-arrow.svelte";
    import ConsoTable from "../ConsoTable.svelte";
    import type { ConsommationsIncludeType } from '$lib/server/classes/Taferie';
    import { enhance } from "$app/forms";
    import Icon from "@iconify/svelte";
    
    export let title:string;
    export let totalCons:number = NaN;
    export let page:number = 1;
    export let nombrePages:number =  NaN;
    export let consommations:ConsommationsIncludeType[] = [];
    export let types: {[key: string]: keyof typeof consommations_type};
    export let fromOption:boolean;
    export let cancelOption:boolean;
</script>

<SectionCard title={title}>
  <form method="get" class="w-full flex flex-col gap-2">
    <slot>

    </slot>
    {#if !isNaN(totalCons)}
    <p class="text-white">Total de {totalCons} consommation(s) sur {nombrePages} page(s). (20 par page)</p>
    {/if}

    <div class="text-black w-full flex flex-col gap-2">
      <div class="flex gap-2">
          <label>
            <p class="text-white">Nums</p>
            <slot name="nums"><input class="w-32" type="number" name="nums"></slot>
          </label>
          <label>
            <p class="text-white">Proms</p>
            <slot name="proms"><input class="w-32" type="number" name="proms"></slot>
          </label>
      </div>
      <select name="sortType" value="date">
        <option value="date">Date/Heure</option>
        <option value="montant">Montant</option>
      </select>
      <select name="sortDir" value="desc">
        <option value="desc">Décroissant</option>
        <option value="asc">Croissant</option>
      </select>
      
      <select name="consoType" value="Tout">
        <option value="Tout">Tout</option>
        {#each Object.entries(types) as [text, value]}
          <option value={value}>{text}</option>
        {/each}
      </select>
      
      <label class="w-full">
        <p class="text-white">Année de la consommation (vide pour toutes) :</p>
        <input name="consoYear" class="w-full p-1 rounded-md" type="number" min="2017" max={new Date().getFullYear()} placeholder="Année: 1989">
      </label>
      <button class="self-center w-14">
        <SquareRightArrow/>
      </button>
    </div>

    <input type="hidden" name="page" bind:value={page}>
    <div class="flex gap-2 justify-center text-black">
      <button type="submit">
        {#if page > 1}
          <button type="button" on:click={()=>{page-=1}} class="bg-white p-2 h-10 rounded-lg">précédent</button>
          <button type="button" on:click={()=>page=1} class="bg-white p-2 size-10 rounded-lg">1</button>
        {/if}
        <button type="button" class="bg-red-500 p-2 w-10 rounded-lg">{page}</button>
        {#if page < nombrePages}
          <button type="button" on:click={()=>page=nombrePages} class="bg-white p-2 size-10 rounded-lg">{nombrePages}</button>
          <button type="button" on:click={()=>page+=1} class="bg-white p-2 h-10 rounded-lg">suivant</button>
        {/if}
      </button>
    </div>
  </form>
  <div class="w-full h-96 overflow-x-hidden no-scrollbar overflow-y-scroll">
    {#if consommations.length == 0}
      <div class="w-full flex justify-center">
        <Icon class="text-8xl" icon="line-md:loading-loop"/>
      </div>
    {:else}
    <ConsoTable {fromOption} consommations={consommations} cancelOption={cancelOption}/>
    {/if}
  </div>
</SectionCard>