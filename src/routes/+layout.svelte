<script lang="ts">
  import "../app.css";
  import {page} from '$app/stores';
  import Navbar from "$lib/components/navbar/Navbar.svelte";

  export let data;
</script>


<div class="relative w-screen h-screen bg-fixed bg-main-bg bg-center bg-cover overflow-x-hidden">
  {#if $page.route.id?.startsWith('/(fast access)') || $page.route.id?.startsWith('/login')}
      <slot/>
  {:else}
    <Navbar session={data.session} id_boquette={data.id_boquette}>
      <slot/>
    </Navbar>
  {/if}
</div>