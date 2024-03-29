<script lang="ts">
    import { enhance } from "$app/forms";
    import type { consommations_type } from "@prisma/client";
    import SectionCard from "../SectionCard.svelte";
    import SquareRightArrow from "../svgs/square-right-arrow.svelte";
    import { z } from "zod";
    import type { consommationsSchema } from "./fullsearch";
    import ConsoTable from "./ConsoTable.svelte";
    import type { ConsommationsIncludeType } from '$lib/server/classes/Taferie';
    
    export let title:string;
    export let totalCons:number;
    export let page:number;
    export let nombrePages:number;
    export let consommations:ConsommationsIncludeType[];
    export let types: {[key: string]: keyof typeof consommations_type};

    const data:z.infer<typeof consommationsSchema> = {
      nums:null,
      proms:null,
      consoType:null,
      consoYear:null,
      page:page,
      sortDir:"asc",
      sortType:"date"
    }
    async function submit(){
      await fetch("?/consommations", {
        method:'post',
        body:JSON.stringify(data)
      });
    }
</script>

<SectionCard title={title}>
  <form on:submit|preventDefault={submit} class="flex flex-col gap-2">
    <p class="text-white">Total de {totalCons} consommation(s) sur {nombrePages} page(s). (100 par page)</p>

    <div class="text-black flex flex-col gap-2">
      <div class="flex gap-2">
        <label>
          <p class="text-white">Nums</p>
          <input type="number" name="nums" value={data.nums}>
        </label>
        <label>
          <p class="text-white">Proms</p>
          <input type="number" name="proms" value={data.proms}>
        </label>
      </div>
      <select name="type" value={data.sortType}>
        <option value="date">Date/Heure</option>
        <option value="montant">Montant</option>
      </select>
      <select name="dir" value={data.sortDir}>
        <option value="asc">Décroissant</option>
        <option value="desc">Croissant</option>
      </select>
      
      <select name="conso_type" value={data.consoType}>
        <option value={null}>Tout</option>
        {#each Object.entries(types) as [text, value]}
          <option value={value}>{text}</option>
        {/each}
      </select>
      
      <label class="w-full">
        <p class="text-white">Année de la consommation (vide pour toutes) :</p>
        <input name="year" class="w-full p-1 rounded-md" type="text" placeholder="Année: 1989" value={data.consoYear}>
      </label>
      <button class="self-center w-14">
        <SquareRightArrow/>
      </button>
    </div>

    <input bind:value={page} class="hidden" type="number" name="page">
    <div class="flex gap-2 justify-center text-black">
      <button type="submit">
        {#if page > 1}
          <button type="button" on:click={()=>page-=1} class="bg-white p-2 h-10 rounded-lg">précédent</button>
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
    <ConsoTable consommations={consommations} cancelOption={true}/>
  </div>
</SectionCard>