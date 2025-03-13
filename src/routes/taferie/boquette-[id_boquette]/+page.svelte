<script lang="ts">
  import BoquetteProfile from "$lib/components/boquette/BoquetteProfile.svelte";
  import GestionBrousouffs from "$lib/components/miscellaneous/GestionBrousouffs.svelte";
  import { triggerPopupForm } from "$lib/stores/popupStore.js";
  import { enhance } from "$app/forms";

  export let data;
  export let form: {
    success: boolean;
    message: string;
  };

  let currData: typeof data.search;
  $: currData = data.search;

  $: triggerPopupForm(form);
</script>

<div class="w-11/12 flex flex-col pt-5 gap-5">
  <BoquetteProfile boquette={data.boquette} taferie={true}>
    <div class="mt-10 flex btn-group variant-filled-primary w-fit self-center">
      <a class="" href="/boquette-{data.boquette.id_boquette}">accéder à la boquette</a>
      <a class="" href="/taferie/boquette-{data.boquette.id_boquette}/editproducts">
        éditer produits
      </a>
    </div>
  </BoquetteProfile>

  <GestionBrousouffs />

  <form use:enhance={()=>{
      
  }} class="card p-2 variant-filled-surface flex flex-col place-items-center place-content-center gap-4" action="?/changer_zident" method="post">
    <p class="font-zagoth text-2xl">Changer Zident - {data.boquette.zident?.nums}ch{data.boquette.zident?.proms}</p>
    <div class="grid grid-cols-2 gap-2 w-full">
      <label>
        Nums
        <input required class="input p-1" type="number" name="nums" value="">
      </label>
      <label>
        Proms
        <input required class="input p-1" type="number" name="proms" value="">
      </label>
    </div>
      <button class="col-span-2 variant-filled-primary btn">Changer</button>
  </form>
</div>
