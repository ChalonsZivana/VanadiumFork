<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
</script>

{#if $page.status === 401}
  <div class="h-screen w-screen flex justify-center items-center">
    <div class="text-3xl text-red-500 text-center">
      Désolé, tu n'es plus autorisé à accéder à cette page...
    </div>
    <a href="/" class="absolute top-3 left-3 w-8">
      <Icon icon="mdi:house" class="w-8 h-8" />
    </a>
  </div>
{:else}
  <h1>{$page.status || "Error"}</h1>
  <p>{$page.error || "Something went wrong."}</p>
{/if}
