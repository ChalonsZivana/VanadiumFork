<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";

  export let value: string;
  export let callback: MouseEventHandler<HTMLButtonElement>|null = null;
  export let color:string = 'bg-blue-600';
  export let isLoading = false;
</script>

<button disabled={isLoading} class="text-white {color} w-fit p-2 rounded-lg" on:click={callback}>
  {value}
</button>
