<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";

  export let value: string;
  export let callback: MouseEventHandler<HTMLButtonElement>|null = null;
</script>

<button class="bg-blue-600 w-fit p-2 rounded-lg" on:click={callback}>
  {value}
</button>
