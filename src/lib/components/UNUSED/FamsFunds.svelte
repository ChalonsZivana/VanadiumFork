<script lang="ts">
  import SectionCard from "../section_card.svelte";

  let funds = 10000
  function handle(){}
</script>

<SectionCard 
  title="Fonds Fam's" 
  buttonText="recharger" 
  buttonHref="rechargement">
    <p class="text-green-700 text-4xl">{funds}€</p>
</SectionCard>
