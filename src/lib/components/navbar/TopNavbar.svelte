<script lang="ts">
  import type { SessionData } from "$lib/server/auth";
    import { onMount } from "svelte";

  export let session:SessionData;

  let isOpen = false;
  const toggle = () => isOpen = !isOpen;
  const close = () => isOpen = false;

  const USER_ROUTES = {
    'Statistiques':'/stats',
    'Me rhopser':'/rhopses',
    'Rechargement':'/rechargement',
    'Usins':'/usins',
    "Info boul's":'/bouls',
  }
  function handleClickOutside(event:MouseEvent) {
    // Check if the clicked element is not within the navbar
    if (!(event.target as HTMLElement).closest('.navbar')) {
      isOpen = false; // Close the navbar
    }
  }
  onMount(()=>{
    window.addEventListener('click', handleClickOutside)
  })
</script>


<div class="navbar z-10">
  <div class="flex p-5 items-center justify-between w-full h-20 bg-red-950">
    <button on:click={toggle} class="w-10 h-10">
      <img src="\svgs\burger-menu-svgrepo-com.svg" alt="" srcset="">
    </button>
    <a href="/" class="font-zagoth text-white text-2xl">My Vanadium</a>
    <a class="w-8 h-8" on:click={close} href={session.user?"/profile":"/login"}>
      <img class="drag-none" src="\svgs\{session.user?'profile':'login'}.svg" alt="" srcset="">
    </a>
  </div>
  <div class="{isOpen?'h-48':'h-0'} {isOpen?'scale-y-100':'scale-y-0'} duration-300 origin-top
            flex flex-col items-center gap-1 
            bg-red-950 text-white
            absolute top-20 w-full">
  <div class="w-1/2 border-t-2"></div>
  {#each Object.entries(USER_ROUTES) as [nom, url]}
    <a on:click={close} href={url}>{nom}</a>
  {/each}
  <form method="POST" action="/login?/logout">
    <button>Déconnexion</button>
  </form>
  </div>
</div>


