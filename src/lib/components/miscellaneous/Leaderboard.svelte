<script lang="ts">
    import type { Top } from "$lib/server/db_structs";
    export let top:Top;
</script>

<div class="flex flex-col place-items-center h-full justify-center items-center">
  <div class="flex w-fit justify-around items-end">
    {#each [2,0,1] as i}
    
      <div class="border-solid {["bg-yellow-600", "bg-gray-500", "bg-amber-900"][i]} w-24 border-2 flex flex-col items-center justify-center p-2 {['h-36','h-28','h-24'][i]}">
        <p>#{i+1}</p>
        <p class="text-ellipsis text-nowrap max-w-full overflow-hidden">{top.leaderboard[i]?.bucque}</p>
        <p>{top.leaderboard[i]?.nums}ch{top.leaderboard[i]?.proms}</p>
      </div>
    {/each}
  </div>

  <div class="flex flex-col">
    {#each top.leaderboard as pg,index}
      {#if index > 2}
        <p>#{index+1} {pg.bucque} - {#if pg.nombre != null} x{pg.nombre} {/if}({pg.nums}Ch{pg.proms})</p>
      {/if}
    {/each}
  </div>
</div>
