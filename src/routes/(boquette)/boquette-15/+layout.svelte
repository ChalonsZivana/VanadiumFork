<script lang="ts">
  import AppLayout from '$lib/components/AppLayout.svelte';
  export let data;
</script>

<AppLayout bind:USER={data.USER} bind:BOQUETTES={data.BOQUETTES} url={null}>
  <slot/>
</AppLayout>