<script lang="ts">
    import SectionCard from "../section_card.svelte";
    let funds = 10000
</script>

<SectionCard 
    title="Fonds"
    buttonText="recharger"
    buttonHref="rechargement">
    <div class="w-full flex justify-center items-center">
        <p class="text-green-700 text-4xl">{funds}€</p>
    </div>
</SectionCard>
