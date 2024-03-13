
<script>
  import Profile from "$lib/components/sections/Profile.svelte";
  import Gifs from "$lib/components/sections/Gifs.svelte";
  import Negats from "$lib/components/sections/negats.svelte";
  export let data;
</script>


<div class="w-11/12 flex flex-col gap-5">
  <Profile user={data.session.user}/>
  <Gifs photo={data.photo}/>
  <Negats negats={data.negats}/>
</div>
