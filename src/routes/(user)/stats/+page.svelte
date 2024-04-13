<script lang="ts">
  import StatsChart from "$lib/components/miscellaneous/StatsChart.svelte";
  import type {Top} from "$lib/server/db_structs.js"
  import SectionCard from "$lib/components/SectionCard.svelte";
  import ToggleSectionCard from "$lib/components/ToggleSectionCard.svelte";
  import Leaderboard from "$lib/components/miscellaneous/Leaderboard.svelte";
  import { enhance } from "$app/forms";

  export let data;
  export let form:{top:Top};

  const depensesTotales = data.consos.reduce((acc,transition) => acc + (transition.montant??0), 0);
  const depensesMax = data.consos.reduce((max, current) => (current.montant??0) > (max.montant??0) ? current : max, data.consos[0]);

  let top:Top;
  let totalNourriture=0;
  let totalAlcool=0;
  data.consos.forEach((e)=>{
    if(Object.values(data.boquettes_nourritures).includes(e.id_boquette)){
      totalNourriture += e.montant;
    } else if(Object.values(data.boquettes_alcool).includes(e.id_boquette)){
      totalAlcool += e.montant;
    }
  })
  const getBoqName = (id_boq:number|null) => data.boquettes.find(e=>e.id_boquette==id_boq)?.nom;
</script>

<div class="flex flex-col items-center gap-1 w-11/12 mb-5">
  <p class="text-white"></p>

  <SectionCard title="Statistiques">
      <p>Total de {depensesTotales.toFixed(2)}€ dépensés</p>
    <StatsChart consos={data.consos} boquettes={data.boquettes}/>
  </SectionCard>
  <SectionCard title="Ton top conso est sur la boquette {getBoqName(depensesMax.id_boquette)} avec un total de {depensesMax.montant?.toFixed(2)}€."/>
  <SectionCard title="Tu as dépensé {Math.round(Math.abs(totalAlcool))}€ en alcool et {Math.round(Math.abs(totalNourriture))}€ en nourriture.">
    <p class="text-xl text-center">{totalAlcool < totalNourriture?"On dirait que tu préfères boire plutôt que manger.":"On dirait que tu préfères manger plutôt que boire."}</p>
  </SectionCard>

  {#await data.tops}
    Chargement tops...
  {:then tops} 
    {#each tops as top, i}
      <ToggleSectionCard title="{top.name}" toggleClass="h-96" >
            <Leaderboard bind:top={top}/>
      </ToggleSectionCard>
    {/each}
  {/await}
  
  <SectionCard title="Statistiques Boquette">
    <form use:enhance={()=>{return ({update})=>{update({reset:false})}}} action="?/stats" method="post"  class="w-full flex flex-col text-2xl gap-5">
      <select required class="w-11/12 h-14 rounded-md text-black" name="id_boquette" placeholder="Boquette" value="0">
        {#each Object.entries(data.boquettes_tops) as [nom, id]}
          <option value={id}>{nom}</option>
        {/each}
      </select>
      <label class="w-full">
        <p>Période (en jours)</p>
        <input class="w-11/12 h-14 rounded-md text-black" type="number" name="jours" value="15">
      </label>
      <label class="w-full">
        <p>Nombre de pgs</p>
        <input class="w-11/12 h-14 rounded-md text-black" type="number" name="take" value="15">
      </label>
      <button class="bg-blue-600 self-center w-36 p-2 rounded-md">Valider</button>
    </form>

    {#if form}
      <Leaderboard top={form.top}/>
    {/if}
  </SectionCard>
</div>
