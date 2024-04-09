<script lang='ts'>
    import RhopseComponent from "$lib/components/miscellaneous/RhopseComponent.svelte";
    export let data;

    export let dialog:HTMLDialogElement;
</script>

<div class="flex justify-center pt-5 w-11/12">
  <RhopseComponent rhopseUrl="/boquette-{data.id_boquette}/rhopse-{data.pg.id_pg}?/rhopse"
  categories={data.categories} produits={data.produits} pg={data.pg} bind:dialog={dialog}
  />
</div>
