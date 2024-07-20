<script lang="ts">
    import type { pg } from "@prisma/client";
    import SectionCard from "../../SectionCard.svelte";
    import SquareRightArrow from "../../svgs/square-right-arrow.svelte";
    import { enhance } from "$app/forms";
    import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
    import MoneyColor from "$lib/components/miscellaneous/MoneyColor.svelte";
    
    export let title:string;
    export let page:number;
    export let nombrePages:number;
    export let totalPgs:number;
    export let pgs:Partial<pg>[];

    console.log(pgs)
</script>

<SectionCard title={title}>
  <form use:enhance={
    async ()=>{
      return async({update})=> update({reset:false});
    }
  } action="?/pgs" method="post" class="w-full flex flex-col gap-2">
    <div class="text-black w-full flex flex-col gap-2">
      <p class="text-white">Total de {totalPgs} pg(s) sur {nombrePages} page(s). (20 par page)</p>

      <label>
        <p class="text-white">Proms</p>
        <slot name="proms"><input class="w-32" type="number" name="proms"></slot>
      </label>
      <select name="sortType" value="nums">
        <option value="nums">Nums</option>
        <option value="solde">Solde</option>
      </select>
      <select name="sortDir" value="desc">
        <option value="desc">Décroissant</option>
        <option value="asc">Croissant</option>
      </select>
      
      <button class="self-center w-14">
        <SquareRightArrow/>
      </button>
    </div>

    <input type="hidden" name="page" bind:value={page}>
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
    <CustomTable elements={pgs} headers={['Nums','Solde']} title={"PG"}>
      <svelte:fragment slot="tbody" let:e>
        {#key e}
          <tr on:click={()=>location.href = `/taferie/pg-${e.id_pg}`} class="divide-x-2 cursor-pointer divide-white ">
            <td class="">{e.nums}Ch{e.proms}</td>
            <td><MoneyColor auto={e.solde}/></td>
          </tr>
        {/key}
      </svelte:fragment>
    </CustomTable>
  </div>
</SectionCard>