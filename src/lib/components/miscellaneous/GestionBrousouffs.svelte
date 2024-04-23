<script lang="ts">
    import { enhance } from "$app/forms";
    import EuroBill from "../svgs/euro-bill.svelte";

  let show = false;
</script>

<div class="mt-5 text-white rounded-lg overflow-clip w-full">
  <button on:click={()=>show=!show} class="font-zagoth text-2xl p-2 bg-red-700 w-full">
    Transfert Brousouffs
  </button>
  <div class="flex flex-col gap-2 bg-red-600 {show?'h-56':'h-0'} {show?'scale-y-100':'scale-y-0'} origin-top duration-300">
    <form on:submit={()=>show=false} action="?/transfert" use:enhance method="post"  class="flex flex-col items-center mt-5 gap-2 w-full">
      <label class="full w-5/6">
        <p class="text-white font-zagoth text-2xl">Montant</p>
        <input required class="w-full p-1 rounded-lg text-black" type="number" step="0.01" name="montant" placeholder="positif ou négatif">
      </label>
      <label class="w-5/6">
        <p class="text-white font-zagoth text-2xl">Libellé</p>
        <input required class="w-full p-1 rounded-lg text-black" type="text" name="libelle" placeholder="Y'a qu'la Fams 11 qui pine">
      </label>
      <div class="flex justify-center w-full">
        <button class="bg-red-500 w-1/2 flex justify-center rounded-md">
          <EuroBill className="w-14 p-1"/>
        </button>
      </div>
    </form>
  </div>
</div>