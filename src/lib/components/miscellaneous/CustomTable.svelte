<script lang="ts" generics="T">
  export let title: string = "";
  export let headers: string[];
  export let elements: T[];
</script>

<!-- Responsive Container (recommended) -->
<div class="table-container w-full flex-grow">
  <!-- Native Table Element -->
  <table class="table table-hover">
    <caption class="bg-red-900 text-white text-2xl tracking-widest">
      {title}
    </caption>
    <thead>
      <tr class="bg-red-600">
        {#each headers as header}
          <th class="">
            {header}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody class="divide-y-2 divide-white">
      {#each elements as e}
        <slot name="tbody" {e} />
      {/each}
      <slot />
    </tbody>
  </table>
</div>
