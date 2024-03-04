<script lang="ts">
    import SectionCard from "$lib/components/section_card.svelte";
    import type { boquettes } from "@prisma/client";

    export let boquette:boquettes|null;
</script>

<SectionCard title="Paramètres">
  <div class="w-full text-white">
    <p>Nom: {boquette?.nom}</p>
    <p>Identifiant: {boquette?.nom_simple}</p>
    <label>
      <input type="checkbox" checked={boquette?.partie_pg}>
      Partie PG
    </label>
  </div>
</SectionCard>