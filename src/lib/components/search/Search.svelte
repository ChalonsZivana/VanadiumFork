<script lang="ts">
    import CustomTable from "../miscellaneous/CustomTable.svelte";
    import MoneyColor from "../miscellaneous/MoneyColor.svelte";
    import { getSearch, type DataToSort, type SearchItemsMap, type SelectTypes, createDataToSort } from "./search";

    export let tableHeaders:{[K in SelectTypes]:string[]} = {
      'Tout':[], 
      'PG':[],
      'Fams':[],
      'Boquette':[]
    }

    export let searchText:string;
    export let selected:SelectTypes ='Tout';
    export let dataToSort: DataToSort;

    $: searchItems = getSearch(searchText, dataToSort);
</script>


<div class="{(searchItems[selected].length==0 && searchText=='')?'h-0':'h-96'} duration-200 flex flex-col overflow-y-scroll w-11/12 gap-2 bg-white rounded-lg overflow-clip">    
  {#if selected == 'Boquette' || selected == 'Tout' && searchItems.Boquette.length}
      <CustomTable title="Boquette" headers={tableHeaders.Boquette}>
        {#each searchItems.Boquette as sI}
          <tr>
            <slot name="Boquette" {sI}/>
          <tr/>
        {/each}
      </CustomTable>
  {/if}
  {#if selected == 'Fams' || selected == 'Tout' && searchItems.Fams.length}
      <CustomTable title="Fams" headers={tableHeaders.Fams}>
        {#each searchItems.Fams as sI}
          <tr>
            <slot name="Fams" {sI}/>
          <tr/>
        {/each}
      </CustomTable>
  {/if}
  {#if selected == 'PG' || selected == 'Tout' && searchItems.PG.length}
      <CustomTable title="PG" headers={tableHeaders.PG}>
        {#each searchItems.PG as sI}
          <tr>
            <slot name="PG" {sI}/>
            
          <tr/>
        {/each}
      </CustomTable>
  {/if}
</div>