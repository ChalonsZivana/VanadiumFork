<script lang="ts">
  import StatsChart from "$lib/components/miscellaneous/StatsChart.svelte";
    import Top from "$lib/components/miscellaneous/Top.svelte";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import ToggleSectionCard from "$lib/components/ToggleSectionCard.svelte";

  export let data;

  const depensesTotales = data.consos.reduce((acc,transition) => acc + (transition.montant??0), 0);
  const depensesMax = data.consos.reduce((max, current) => (current.montant??0) > (max.montant??0) ? current : max, data.consos[0]);

  const getBoqName = (id_boq:number|null) => data.boquettes.find(e=>e.id_boquette==id_boq)?.nom;
</script>

<div class="flex flex-col items-center gap-1 w-11/12">
  <p class="text-white"></p>

  <SectionCard title="Statistiques">
    <p>Total de {depensesTotales.toFixed(2)}€ dépensés</p>
    <StatsChart consos={data.consos} boquettes={data.boquettes}/>
  </SectionCard>
  <SectionCard title="Ton top conso est sur la boquette {getBoqName(depensesMax.id_boquette)} avec un total de {depensesMax.montant?.toFixed(2)}€."></SectionCard>

  {#await data.tops}
    Chargement tops...
  {:then tops} 
    {#each tops as top, i}
      <ToggleSectionCard title="{top.name}" toggleClass="h-96" >
        <Top top={top}/>
      </ToggleSectionCard>
    {/each}
  {/await}
  
</div>
