<script lang="ts">
  export let title:string;
  export let headers:string[];
</script>


<table class="bg-white">
  <caption class="bg-gray-300 font-zagoth text-3xl tracking-widest">
    {title}
  </caption>
  <thead class="text-sm">
    <tr>
      {#each headers as header}  <th>  {header}  </th>  {/each}
    </tr>
  </thead>
  <tbody class="text-xs text-center child:border-t-1 child:border-black child:child:pt-2 child:child:pb-2">
    <slot/>
  </tbody>
</table>