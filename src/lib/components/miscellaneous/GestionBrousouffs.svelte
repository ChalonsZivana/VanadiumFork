<script lang="ts">
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";
</script>

<div
    class="flex flex-col gap-2 variant-filled-surface rounded-lg p-2 origin-top duration-300"
  >
    <form
      action="?/transfert"
      use:enhance
      method="post"
      class="flex flex-col items-center mt-5 gap-2 w-full"
    >
    <p class="font-zagoth text-2xl">Transfert Brousoufs</p>

      <label class="full w-5/6">
        <p class="font-zagoth text-2xl">Montant</p>
        <input
          required
          class="w-full p-1 rounded-lg text-black"
          type="number"
          step="0.01"
          name="montant"
          placeholder="positif ou négatif"
        />
      </label>
      <label class="w-5/6">
        <p class="font-zagoth text-2xl">Libellé</p>
        <input
          required
          class="w-full p-1 rounded-lg text-black"
          type="text"
          name="libelle"
          placeholder="Y'a qu'la Fams 11 qui pine"
        />
      </label>
      <div class="flex justify-center w-full">
        <button class="btn variant-filled-primary w-80">
          <Icon class="text-4xl" icon="mdi:money" />
        </button>
      </div>
    </form>
  </div>