<script lang="ts">
  import type { User } from "$lib/server/auth";
    import type { boquettes } from "@prisma/client";
  import BottomNavbar from "./BottomNavbar.svelte";
  import TopNavbar from "./TopNavbar.svelte";

  export let user:User | null;
  export let boquettes:boquettes[];
  export let id_boquette:number | null;
</script>


<div class="h-screen flex flex-col">
  <TopNavbar user={user}/>
  <div class="flex flex-col items-center h-full w-full overflow-x-hidden">
    <slot/>
  </div>
  <BottomNavbar boquettes={boquettes} id_boquette={id_boquette}/>
</div>