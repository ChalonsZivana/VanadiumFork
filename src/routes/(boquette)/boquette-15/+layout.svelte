<script lang="ts">
  import Navbar from "$lib/components/navbar/Navbar.svelte";
  export let data;
</script>

<Navbar user={data.USER} boquettes={data.BOQUETTES} id_boquette={15}>
  <slot/>
</Navbar>