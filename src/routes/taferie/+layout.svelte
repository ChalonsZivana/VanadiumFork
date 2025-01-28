<script lang="ts">
    import AppLayout from '$lib/components/AppLayout.svelte';
    import Icon from '@iconify/svelte';

    export let data;
</script>

<AppLayout bind:USER={data.USER} bind:BOQUETTES={data.BOQUETTES} url={null}>
    {#if data.config.vanazocque?.valeur=="1"}
        <div class="w-full sticky top-0 z-50 variant-filled-warning flex items-center justify-around">
            <Icon class="text-7xl" icon="mdi:warning-outline"/>
            <p class="font-bold text-2xl">Vanadium est zocqué</p>
            <Icon class="text-7xl" icon="mdi:warning-outline"/>
        </div>
    {/if}
    <slot/>
</AppLayout>