<script lang="ts">
  export let title:string="";
  export let headers:string[];
</script>


<table class="bg-white w-full">
  <caption class="bg-gray-300 font-zagoth text-3xl tracking-widest">
    {title}
  </caption>
  <thead class="sticky top-0 text-sm bg-gray-300">
    <tr>
      {#each headers as header}  <th>  {header}  </th>  {/each}
    </tr>
  </thead>
  <tbody class="text-xs text-center divide-y-1 divide-black child:child:p-2 ">
    <slot/>
  </tbody>
</table>