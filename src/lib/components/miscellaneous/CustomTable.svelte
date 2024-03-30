<script lang="ts" generics="T">
  export let title:string="";
  export let headers:string[];
  export let elements:T[];
</script>


<table class="bg-white w-full">
  <caption class="bg-red-900 text-2xl tracking-widest">
    {title}
  </caption>
  <thead class="w-full h-10 sticky top-0 text-sm text-white">
    <tr class="bg-red-600">
      {#each headers as header}  <th class="">  
        {header}  </th>  
      {/each}
    </tr>
  </thead>
  <tbody class="bg-red-100 text-black text-xs text-center divide-y-2 divide-white ">
    {#each elements as e}
      <slot name="tbody" {e}/>
    {/each}
    <slot/>
  </tbody>
</table>