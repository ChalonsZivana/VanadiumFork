<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import {onMount} from 'svelte'
    import { fly } from 'svelte/transition';
    export let data;
    import OneSignal from '@nolanx/svelte-onesignal';

    onMount(async ()=>{
        await OneSignal.init(
            {
                appId:'8c47c8d7-2816-439b-8b07-59217c8431a6', autoResubscribe:true, allowLocalhostAsSecureOrigin:true})
    })
</script>

<Navbar user={data.USER} boquettes={data.BOQUETTES} id_boquette={null}>
    {#key data.url}
        <div in:fly={{x:-200, duration:300, delay:300}} out:fly={{x:200, duration:300}}>
            <slot/>
        </div>
    {/key}
</Navbar>
