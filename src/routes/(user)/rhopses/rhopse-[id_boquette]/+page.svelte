<script lang="ts">
  import Popup from "$lib/components/miscellaneous/Popup.svelte";
  import RhopseComponent from "$lib/components/miscellaneous/RhopseComponent.svelte";
    import { triggerPopupForm } from "$lib/stores/popupStore.js";

  export let data;
  export let dialog:HTMLDialogElement;
  export let form:{success:boolean, message:string}[];

  $:triggerPopupForm(form);
</script>

<div class="flex mt-20 w-11/12">
    <RhopseComponent rhopseUrl="/rhopses/rhopse-{data.id_boquette}?/rhopse"
    bind:categories={data.categories} bind:produits={data.products} bind:pg={data.USER.pg} bind:dialog={dialog}
    />
</div>