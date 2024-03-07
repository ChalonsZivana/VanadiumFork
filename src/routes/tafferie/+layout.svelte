<script>
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    export let data;

</script>

<Navbar session={data.session} id_boquette={20}>
    <slot/>
</Navbar>
