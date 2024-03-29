<script lang="ts">
  export let special = false;
</script>

{#if special}
  <div class="animate-shine">
    <slot/>
  </div>
{:else}
  <slot/>
{/if}