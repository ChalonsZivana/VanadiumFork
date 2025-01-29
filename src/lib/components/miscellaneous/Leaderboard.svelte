<script lang="ts">
  import type { Top } from "$lib/server/db_structs";

  export let top: Top;
</script>

<div
  class="flex flex-col place-items-center justify-center items-center"
>
  <div class="flex w-full justify-around items-end">
    {#each [2, 0, 1] as i}
      <div
        class="border-solid {['bg-yellow-600', 'bg-gray-500', 'bg-amber-900'][
          i
        ]} w-1/3 border-2 flex flex-col items-center justify-center p-2 {[
          'aspect-[8/12]',//h-full
          'aspect-[10/12]',//h-1/2
          'aspect-[10/10]',//h-1/3
        ][i]}"
      >
        <p>#{i + 1}</p>
        <p class="text-ellipsis text-nowrap max-w-full overflow-hidden">
          {top.leaderboard[i]?.bucque}
        </p>
        <p>{top.leaderboard[i]?.nums}ch{top.leaderboard[i]?.proms}</p>
      </div>
    {/each}
  </div>

  <div class="flex flex-col mt-10">
    {#each top.leaderboard as pg, index}
      {#if index > 2}
        <p>
          #{index + 1}
          {pg.bucque} - {#if pg.nombre != null}
            x{pg.nombre}
          {/if}({pg.nums}Ch{pg.proms})
        </p>
      {/if}
    {/each}
  </div>
</div>
