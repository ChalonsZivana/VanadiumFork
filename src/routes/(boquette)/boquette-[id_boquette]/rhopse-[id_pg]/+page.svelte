<script lang='ts'>
    import RhopseComponent from "$lib/components/miscellaneous/RhopseComponent.svelte";
    import { triggerPopupForm } from "$lib/stores/popupStore.js";
    export let data;
    export let form:{success:boolean, message:string}[];

    export let dialog:HTMLDialogElement;

    $:triggerPopupForm(form);
</script>

<div class="flex h-full items-center justify-center pt-5 w-11/12">
  {#if data.pg.can_buy}
    <RhopseComponent rhopseUrl="/boquette-{data.id_boquette}/rhopse-{data.pg.id_pg}?/rhopse"
    categories={data.categories} produits={data.produits} pg={data.pg} bind:dialog={dialog}
    />
  {:else}
  <div class="bg-red-100 size-96 flex justify-center items-center">
    <p>{data.pg.nums}{data.pg.tabagns}{data.pg.proms} n'a plus le droit d'acheter</p>
  </div>
  {/if}
</div>
