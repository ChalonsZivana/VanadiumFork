<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";

  export let data;
  
  const users = Object.fromEntries(data.bouls_users.map((e)=>[e.id_pg, e]));
  
  const bouls = data.bouls.map((e) => {
    return {boquette:e.nom, respo:data.bouls_users.find((i)=>i.id_pg == e.id_pg)}}
  )
  
  
</script>

<div class="h-screen w-screen flex justify-center items-center">
  <div class="w-96">
    <SectionCard title="Liste boul's">
      <div class="flex flex-col">
        <p class="text-2xl">Gestion boquette</p>
        {#each bouls as boquette}
          <p class="text-sm">{boquette.boquette} - {boquette.respo?.nums}Ch{boquette.respo?.proms}   ({boquette.respo?.bucque})</p>
        {/each}
      </div>
    </SectionCard>
  </div>
  
</div>
