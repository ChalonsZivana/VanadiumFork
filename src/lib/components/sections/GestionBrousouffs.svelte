<script lang="ts">
    import SectionCard from "../SectionCard.svelte";
    import MyButton from "../miscellaneous/MyButton.svelte";
</script>
<SectionCard title="Gestion Brousouffs">
  <form action="?/transfert" method="post"  class="flex flex-col items-center gap-2 w-full">
    <label class="full w-5/6">
      <p class="text-white font-zagoth text-xl">Montant</p>
      <input class="w-full p-1 rounded-lg" type="number" name="montant" placeholder="positif ou négatif">
    </label>
    <label class="w-5/6">
      <p class="text-white font-zagoth text-xl">Libellé</p>
      <input class="w-full p-1 rounded-lg" type="text" name="libellé" placeholder="Y'a qu'la Fams 11 qui pine">
    </label>
    <MyButton value="transférer"/>
  </form>
</SectionCard>