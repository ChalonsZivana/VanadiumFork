<script lang="ts">
  import StatsChart from "$lib/components/miscellaneous/StatsChart.svelte";
  import type { Top } from "$lib/server/db_structs.js";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import Leaderboard from "$lib/components/miscellaneous/Leaderboard.svelte";
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";

  export let data;
  export let form: { top: Top };

  const depensesTotales = data.consos.reduce(
    (acc, transition) => acc + (transition.montant ?? 0),
    0,
  );
  const depensesMax = data.consos.reduce(
    (max, current) =>
      (current.montant ?? 0) > (max.montant ?? 0) ? current : max,
    data.consos[0],
  );
  let totalNourriture = 0;
  let totalAlcool = 0;
  let topsSaved:{
    [k: string]: Top;
  } = Object.fromEntries(Object.entries(data.boquettes_tops).map(([name,id_boquette]) => [id_boquette, {name, leaderboard:[]}]));

  onMount(() => {
    data.consos.forEach((e) => {
      if (Object.values(data.boquettes_nourritures).includes(e.id_boquette)) {
        totalNourriture += e.montant;
      } else if (Object.values(data.boquettes_alcool).includes(e.id_boquette)) {
        totalAlcool += e.montant;
      }
    });
  });

  const getBoqName = (id_boq: number | null) =>
    data.boquettes.find((e) => e.id_boquette == id_boq)?.nom;

  async function getTop(id_boquette:number,nom:string) {
    const res = await fetch('/stats', {method:'POST', body:JSON.stringify({id_boquette,nom})});
    const top = await res.json() as Top;
    return top;
  }

</script>

<div class="flex flex-col items-center gap-4 w-full mt-5 mb-5 p-5">
  {#if data.consos.length != 0}
    <div class="card w-full">
      <div class="card-header">
        <p class="font-zagoth h1 text-center">Statistiques</p>
      </div>

      <section class="flex flex-col items-center p-2">
        <p>Total de {Math.abs(depensesTotales).toFixed(2)}€ dépensés</p>
        <StatsChart consos={data.consos} boquettes={data.boquettes} />
      </section>
    </div>

    <div class="w-full">
      <SectionCard
        title="Ton top conso est sur la boquette {getBoqName(
          depensesMax.id_boquette,
        )} avec un total de {Math.abs(depensesMax.montant).toFixed(2)}€."
      />
    </div>

    <div class="w-full">
      <SectionCard
        title="Tu as dépensé {Math.round(
          Math.abs(totalAlcool),
        )}€ en alcool et {Math.round(
          Math.abs(totalNourriture),
        )}€ en nourriture."
      >
        <span
          >{totalAlcool > totalNourriture
            ? "On dirait que tu préfères boire plutôt que manger."
            : "On dirait que tu préfères manger plutôt que boire."}</span
        >
      </SectionCard>
    </div>


    <!-- <SectionCard title="Ton top conso est sur la boquette {getBoqName(depensesMax.id_boquette)} avec un total de {depensesMax.montant?.toFixed(2)}€."/>
  <SectionCard title="Tu as dépensé {Math.round(Math.abs(totalAlcool))}€ en alcool et {Math.round(Math.abs(totalNourriture))}€ en nourriture.">
    <p class="text-xl text-center">{totalAlcool < totalNourriture?"On dirait que tu préfères boire plutôt que manger.":"On dirait que tu préfères manger plutôt que boire."}</p>
  </SectionCard> -->

    <div class="w-full card">
      <Accordion>
        {#key topsSaved}
          {#each Object.entries(topsSaved) as [id_boquette, top] (id_boquette)}
            <AccordionItem>
              <svelte:fragment slot="lead"
                ><Icon icon="mdi:rank" /></svelte:fragment
              >
              <svelte:fragment slot="summary"><p class="text-3xl">{top.name}</p></svelte:fragment>
              <svelte:fragment slot="content">
                {#await getTop(parseInt(id_boquette), top.name) }
                  <p>Loading...</p>
                {:then top} 
                  <Leaderboard top={top} />
                {/await}
              </svelte:fragment>
            </AccordionItem>
          {/each}
        {/key}
      </Accordion>
    </div>
  {/if}

  <form
    use:enhance={() => {
      return async ({ update }) => {
        await update({ reset: false });
      };
    }}
    action="?/stats"
    method="post"
    class="card p-4 sm:aspect-video variant-filled-surface flex flex-col text-2xl gap-5"
  >
    <label class="label">
      <span>Boquette</span>
      <select class="select" value={0} name="id_boquette">
        {#each Object.entries(data.boquettes_tops) as [nom, id]}
          <option value={id}>{nom}</option>
        {/each}
      </select>
    </label>
    <label>
      <span>Période (en jours)</span>
      <input
        class="input p-1"
        required
        type="number"
        name="jours"
        value="15"
        min="1"
      />
    </label>

    <label>
      <span>Nombre de PGs</span>
      <input
        class="input p-1"
        required
        type="number"
        name="take"
        value="15"
        min="1"
      />
    </label>

    <button class="btn variant-filled-primary"><span>Valider</span></button>
  </form>

  {#if form}
    <div class="card variant-filled-surface p-4 ">
      <Leaderboard top={form.top} />
    </div>
  {/if}
</div>
