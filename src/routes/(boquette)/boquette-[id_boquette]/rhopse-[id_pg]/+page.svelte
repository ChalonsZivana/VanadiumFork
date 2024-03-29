<script lang='ts'>
    import RhopseComponent from "$lib/components/miscellaneous/RhopseComponent.svelte";
    export let data;

    export let dialog:HTMLDialogElement;
</script>

<div class="flex justify-center pt-5 w-11/12">
  <RhopseComponent 
  categories={data.categories} produits={data.produits} pg={data.pg} id_boquette={data.id_boquette} bind:dialog={dialog}
  />
</div>
