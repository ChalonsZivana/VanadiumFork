<script>
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import Warning from "$lib/components/svgs/warning.svelte";
    export let data;    
</script>

<Navbar user={data.USER} boquettes={data.BOQUETTES} id_boquette={20}>
    {#if data.config.vanazocque?.valeur=="1"}
        <div class="w-full sticky top-0 z-50 bg-yellow-200 flex items-center justify-between">
            <Warning className="size-16"/>
            <p class="font-bold">Vanadium est zocqué</p>
            <Warning className="size-16"/>
        </div>
    {/if}
    <slot/>
</Navbar>
