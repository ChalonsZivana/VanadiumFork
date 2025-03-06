<script lang="ts">
    import { enhance } from "$app/forms";
    import Icon from "@iconify/svelte";

  export let data;
</script>

<div class="flex flex-col place-content-center place-items-center gap-4">
  <div class="card p-4 flex flex-col gap-4 place-items-center">
    <p class="text-3xl">Membres</p>
    <div class="flex flex-col gap-4 w-80">
      {#each data.appartenance_boquettes as app}
        <div class="flex place-items-center place-content-around">
          <p>{app.pg?.nums}ch{app.pg?.proms}</p>
          <form use:enhance action="?/supprimer_membre" method="post">
            <input type="hidden" name="id_appartenance_boquette" value={app.id}>
            <button class="btn"><Icon icon="mdi:delete"/></button>
          </form>
        </div>
      {/each}
    </div>
  </div>
  
  <form use:enhance method="post" action="?/ajouter_membre" class="card w-80 p-4 flex flex-col place-items-center place-content-center gap-4">
    <label>
      Nums
      <input class="input" type="number" name="nums">
    </label>
    <label>
      Proms
      <input class="input" type="number" name="proms">
    </label>
    <button class="btn variant-filled-primary">Ajouter membre</button>
  </form>
</div>


