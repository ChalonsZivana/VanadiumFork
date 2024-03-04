<script lang="ts">
  import type { SessionData } from "$lib/server/auth";
  import BottomNavbar from "./BottomNavbar.svelte";
  import TopNavbar from "./TopNavbar.svelte";

  export let session:SessionData;
  export let id_boquette:number;
</script>


<div class="h-screen flex flex-col">
  <TopNavbar session={session}/>
  <div class="flex h-full pt-2 justify-center overflow-y-scroll overflow-x-hidden">
    <slot/>
  </div>
  <BottomNavbar session={session} id_boquette={id_boquette}/>
</div>