<script lang="ts">
  import BoquetteProfile from "$lib/components/boquette/BoquetteProfile.svelte";
  import type { boquettes } from "@prisma/client";

  export let data;
  let boquette: boquettes;
  $: boquette =
    data.BOQUETTES.find((e) => e.id_boquette == data.id_boquette) ??
    data.BOQUETTES[0];
</script>

<div class="w-11/12 mt-5 flex flex-col gap-5 justify-center items-center">
  <BoquetteProfile {boquette} />

  {#each data.discale as music}
    <div
      class="flex p-2 flex-col justify-center items-center text-white bg-red-950 w-full gap-2"
    >
      <p class="text-xl text-center">{music.titre_auteur}</p>
      <form method="post" action="?/delete" class="flex gap-5">
        <a href={music.lien_musique} target="_blank">
          <div class="bg-red-600 w-fit p-2 rounded-lg">Accéder</div>
        </a>
        <input type="hidden" name="id" value={music.id} />

        <button class="bg-red-600 w-fit p-2 rounded-lg">Supprimer</button>
      </form>
    </div>
  {/each}
</div>
