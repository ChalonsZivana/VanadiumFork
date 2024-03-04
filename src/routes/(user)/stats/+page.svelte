<script lang="ts">
  import StatsChart from "$lib/components/miscellaneous/StatsChart.svelte";
import SectionCard from "$lib/components/section_card.svelte";

  export let data;
  const extandeds = data.tops.map(_=>false);
  const toggle = (i:number)=>extandeds[i] = !extandeds[i]

  const depensesTotales = data.consos.reduce((acc,transition) => acc + (transition.debit??0), 0);
  const depensesMax = data.consos.reduce((max, current) => (current.debit??0) > (max.debit??0) ? current : max, data.consos[0]);

  const getBoqName = (id_boq:number|null) => data.boquettes.find(e=>e.id_boquette==id_boq)?.nom;
</script>

<div class="flex flex-col justify-center items-center gap-1">
  <p class="text-white"></p>

  <div class="w-80">
    <SectionCard title="Statistiques">
      <p>Total de {depensesTotales.toFixed(2)}€ dépensés</p>
      <StatsChart consos={data.consos} boquettes={data.boquettes}/>
    </SectionCard>
  </div>
  <div class="w-80">
    <SectionCard title="Ton top conso est sur la boquette {getBoqName(depensesMax.id_boquette)} avec un total de {depensesMax.debit?.toFixed(2)}€."></SectionCard>
  </div>


  {#each data.tops as top, i}
    <button on:click={()=>toggle(i)} class="w-80 {[extandeds[i]?'h-96':'h-14']} duration-300 overflow-hidden">
      <SectionCard title="{top.name}">
        <div class="flex flex-col">
          <div class="flex w-full justify-around items-end">
            {#each [1,0,2] as i}
              <div class="border-solid w-24 border-2 flex flex-col items-center justify-center p-2 {['h-36','h-24','h-28'][i]}">
                <p>#{i+1}</p>
                <p class="text-ellipsis text-nowrap max-w-full overflow-hidden">{top.leaderboard[i].bucque}</p>
                <p>{top.leaderboard[i].nums}ch{top.leaderboard[i].proms}</p>
              </div>
            {/each}
          </div>

          {#each top.leaderboard as pg,index}
            {#if index > 2}
              <p>#{index+1} {pg.bucque} - {#if pg.nombre != null} x{pg.nombre} {/if}({pg.nums}Ch{pg.proms})</p>
            {/if}
          {/each}
        </div>
      </SectionCard>
    </button>
  {/each}
</div>
