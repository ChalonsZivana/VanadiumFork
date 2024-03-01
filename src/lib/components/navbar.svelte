<script lang="ts">
    import { onMount } from "svelte";

  const routes = {
    'Statistiques':'/stats',
    'Me rhopser':'/rhopses',
    'Rechargement':'/rechargement',
    'Usins':'/usins',
    "Info boul's":'/bouls',
  }

  let isOpen = false;
  function toggle(){
    isOpen = !isOpen;
  }

  function close(){
    isOpen = false;
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


<div class="fixed left-0 top-0">
  <div class="h-20 md:h-0 w-screen bg-red-950 flex justify-center items-center">
    <a href="/" class="font-zagoth text-white text-2xl">My Vanadium</a>
  </div>
  <div class="navbar
    flex items-center gap-5 p-5 text-white bg-red-950
    flex-col w-full
    md:sticky md:flex-row md:scale-y-100
    {isOpen?'h-72':'h-0'} md:h-20
    {isOpen?'scale-y-100':'scale-y-0'} duration-100 origin-top">
    
    <a href="/" class="hidden md:block font-zagoth text-white text-2xl">My Vanadium</a>

    {#each Object.entries(routes) as [text,route]}
      <a on:click={close} href={route}>{text}</a>
    {/each}
    
    <form method="POST" action="/login?/logout">
      <button>Déconnexion</button>
    </form>
  </div>
</div>


<button class="navbar fixed top-5 left-5 md:hidden" on:click={toggle}>
  <div class="w-10 h-10">
    <img src="\svgs\burger-menu-svgrepo-com.svg" alt="" srcset="">
  </div>
</button>





<a 
  on:click={close} href="profile" 
  class="flex gap-5 justify-center items-center navbar fixed top-5 right-5">
  
  <div class="w-10 h-10">
    <img class="drag-none" src="\svgs\profile.svg" alt="" srcset="">
  </div>
</a>

