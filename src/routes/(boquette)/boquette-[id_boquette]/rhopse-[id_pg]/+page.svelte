<script lang='ts'>
    import Popup from "$lib/components/miscellaneous/Popup.svelte";
    import RhopseComponent from "$lib/components/miscellaneous/RhopseComponent.svelte";
    export let data;
    export let form:{success:boolean, message:string}[];

    export let dialog:HTMLDialogElement;
</script>

<Popup bind:form={form}/>

<div class="flex justify-center pt-5 w-11/12">
  <RhopseComponent rhopseUrl="/boquette-{data.id_boquette}/rhopse-{data.pg.id_pg}?/rhopse"
  categories={data.categories} produits={data.produits} pg={data.pg} bind:dialog={dialog}
  />
</div>
