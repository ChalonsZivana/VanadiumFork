<script lang="ts">
  import { type pg } from "@prisma/client";
  import SubmitDialog from "../miscellaneous/SubmitDialog.svelte";

  export let pg:pg;
  export let dialog:HTMLDialogElement;
</script>

<SubmitDialog customEnhance={()=>{return ({update})=>update({reset:false})}} formAction="/taferie/pg-{pg.id_pg}?/editPg" bind:dialog={dialog} title="Edition PG - {pg.nums}Ch{pg.proms}"
buttonText='Editer' >
  <label class="w-full">
    <p class="font-zagoth text-xl text-white">Nom</p>
    <input required name="nom" value={pg.nom} class="w-full p-1 h-8 border-gray-300 border-1 rounded-md" type="text">
  </label>
  <label class="w-full">
    <p class="font-zagoth text-xl text-white">Prénom</p>
    <input required name="prenom" value={pg.prenom} class="w-full p-1 h-8 border-gray-300 border-1 rounded-md" type="text">
  </label>
  <label class="w-full">
    <p class="font-zagoth text-xl text-white">Bucque</p>
    <input required name="bucque" value={pg.bucque} class="w-full p-1 h-8 border-gray-300 border-1 rounded-md" type="text">
  </label>
  <label class="w-full">
    <p class="font-zagoth text-xl text-white">Adresse Mail</p>
    <input required name="email" value={pg.email} class="w-full p-1 h-8 border-gray-300 border-1 rounded-md" type="text">
  </label>
  <label class="w-full">
    <p class="font-zagoth text-xl text-white">Nums</p>
    <input required name="nums" value={pg.nums} class="w-full p-1 h-8 border-gray-300 border-1 rounded-md" type="text">
  </label>
  <label class="w-full">
    <p class="font-zagoth text-xl text-white">TBK</p>
    <select disabled name="tabagns"  class="w-full p-1 h-8 border-gray-300 border-1 rounded-md">
      <option value="Ch">Ch</option>
      <!-- Erreur lors de l'import de pg_tabagns, de toute façon on est que de chalons -->
      <!-- {#each Object.keys(pg_tabagns) as tabagns}
        <option value={tabagns}>{tabagns}</option>
      {/each} -->
    </select>
  </label>
  <label class="w-full">
    <p class="font-zagoth text-xl text-white">Proms</p>
    <input required name="proms" value={pg.proms} class="w-full p-1 h-8 border-gray-300 border-1 rounded-md" type="text">
  </label>
</SubmitDialog>