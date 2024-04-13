<script>
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    export let data;
    export let form;

    $:{
        if(form){
        console.log('yo')
        }
    }
</script>

<Navbar user={data.USER} boquettes={data.BOQUETTES} id_boquette={20}>
    <slot/>
</Navbar>
