<script lang="ts">
  import type { boquettes } from "@prisma/client";
  import SubmitDialog from "../miscellaneous/SubmitDialog.svelte";

  export let boquette: boquettes;
  export let dialog: HTMLDialogElement;
</script>

<SubmitDialog
  customEnhance={() => {
    return ({ update }) => update({ reset: false });
  }}
  formAction="/boquette-{boquette.id_boquette}?/editBoquette"
  bind:dialog
  title="Edition Boquette - {boquette.nom}"
  buttonText="Editer"
>
  <label class="w-full">
    <p class="font-zagoth text-xl text-white">Nom</p>
    <input
      name="nom"
      value={boquette.nom}
      class="w-full input p-1 h-8 border-gray-300 border-1 rounded-md"
      type="text"
    />
  </label>

  <label class="w-full">
    <p class="font-zagoth text-xl text-white">Identifiant</p>
    <input
      name="nom_simple"
      value={boquette.nom_simple}
      class="w-full input p-1 h-8 border-gray-300 border-1 rounded-md"
      type="text"
    />
  </label>

  <label class="w-full">
    <p class="font-zagoth text-xl text-white">Nouveau mot de passe</p>
    <input
      name="password"
      value=""
      class="w-full input p-1 h-8 border-gray-300 border-1 rounded-md"
      type="text"
    />
  </label>

  <label class="w-full">
    <p class="font-zagoth text-xl text-white">Confirmation mot de passe</p>
    <input
      name="password_confirmation"
      value=""
      class="w-full input p-1 h-8 border-gray-300 border-1 rounded-md"
      type="text"
    />
  </label>

  <div class="flex flex-col text-white">
    <label
      ><input type="checkbox" name="partie_pg" checked={boquette.partie_pg} />
      Partie PG
    </label>
  </div>
</SubmitDialog>
