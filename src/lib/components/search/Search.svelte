<script lang="ts">
    import { onMount } from "svelte";
    import { getSearch, type DataToSort, type SelectTypes } from "./search";

    export let searchText:string;
    export let selected:SelectTypes ='Tout';
    export let dataToSort: DataToSort;

    onMount(()=>{

    })

    $: searchItems = getSearch(searchText, dataToSort);
</script>


<div class="{(searchItems[selected].length==0 && searchText=='')?'h-0':'h-96'} duration-200 flex flex-col overflow-y-scroll w-full gap-2 bg-red-900 rounded-lg overflow-clip">    
  {#if selected == 'Boquette' || selected == 'Tout' && searchItems.Boquette.length}
    <slot name="Boquette" sIB={searchItems.Boquette}/>
  {/if}
  {#if selected == 'Fams' || selected == 'Tout' && searchItems.Fams.length}
    <slot name="Fams" sIF={searchItems.Fams}/>
  {/if}
  {#if selected == 'PG' || selected == 'Tout' && searchItems.PG.length}
    <slot name="PG" sIP={searchItems.PG}/>
  {/if}
</div>