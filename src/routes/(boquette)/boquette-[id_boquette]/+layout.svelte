<script lang="ts">
  import Navbar from "$lib/components/navbar/Navbar.svelte";
  export let data;
</script>

<Navbar session={data.session} id_boquette={data.id_boquette}>
  <slot/>
</Navbar>