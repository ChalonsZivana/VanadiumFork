
<script>
  import Profile from "$lib/components/sections/Profile.svelte";
  import Gifs from "$lib/components/sections/Gifs.svelte";
  import Negats from "$lib/components/sections/negats.svelte";
  import FoylsSong from "$lib/components/sections/foys_song.svelte";
  import Rembours from "$lib/components/sections/rembours.svelte";
  import Rhopses from "$lib/components/sections/rhopses.svelte";

  
  export let data;
  
  let componentsList  = [
    //Gifs,
    Profile,
    Negats,
    FoylsSong,
    // Rembours,
    // Rhopses,
    // TopConsummer
  ];

</script>


<div class="flex flex-col items-center gap-5 h-full grid-cols-2 p-10 md:grid">   
  <div class="w-80"><Profile user={data.session.user}/></div>
  
  <div class="w-80"><Gifs photo={data.photo}/></div>
  <div class="w-80"><Negats/></div>
</div>
