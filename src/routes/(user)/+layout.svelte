<script lang="ts">
	import { AppBar } from "@skeletonlabs/skeleton";
	import Icon from "@iconify/svelte";
    import { page } from '$app/stores';
    import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
    import LogalSoce from "$lib/components/svgs/logal-soce.svelte";
    import OneSignal from '@nolanx/svelte-onesignal';
    import { fly } from 'svelte/transition';
    import {onMount} from 'svelte';

    export let data;

    onMount(async ()=>{
        await OneSignal.init(
            {
                appId:'8c47c8d7-2816-439b-8b07-59217c8431a6', autoResubscribe:true, allowLocalhostAsSecureOrigin:true})
    });

    type BoquetteIconMap = {
      [key: number]: string;
    };

    let showBoquettes = false;
    const sections =  [
        {icon:"mdi:event-note", href:'/rhopses'},
        {icon:"mdi:bar-chart", href:'/stats'},
        {icon:"custom:LogalSoce", href:'/test'},
        {icon:"mdi:anvil", href:'/usins'},
        {icon:"mdi:payment", href:'/rechargement'},
    ];

    const boquettesIcons: BoquetteIconMap = {
    1:"mdi:food-croissant",
    2:"mdi:beer-outline",
    3:"mdi:cheese",
    4:"mdi:whatshot",
    7:"healthicons:alcohol-cessation",
    8:"mdi:tshirt-crew",
    17:"mdi:chips",
    20:"tabler:coin-euro",
    143:"mdi:glass-cocktail",
    147:"mdi:home-off",
    193:"mdi:food",
    195:"mdi:pizza",
    197:"mdi:salt"
  }
</script>

<div class="relative w-screen h-screen flex flex-col justify-between">
  <AppBar background="" border="" gridColumns="grid-cols-3" slotTrail="place-content-end text-4xl">
		<svelte:fragment slot="lead">
      <span class="flex items-end gap-4">
        {#if data.BOQUETTES.length <= 2}
          {#each data.BOQUETTES as boq}
            <a class="text-3xl" href="/boquette-{boq.id_boquette}">
              <Icon icon={boquettesIcons[boq.id_boquette]}/>
            </a>
          {/each}
        {:else}
        <div class:card={showBoquettes} class:variant-filled-surface={showBoquettes} class="absolute p-1 left-2 top-2 card flex flex-col items-center gap-4 ">
          <button on:click={()=>showBoquettes = !showBoquettes} class="btn-icon text-4xl">
            <Icon icon="mdi:arrow-down-box" />
          </button>

          {#if showBoquettes}
          {#each data.BOQUETTES as boq}
            <a class="text-3xl" href="/boquette-{boq.id_boquette}">
              <Icon icon={boquettesIcons[boq.id_boquette]}/>
            </a>
          {/each}
          {/if}
        </div>
        
        {/if}
        
      </span>

      
    </svelte:fragment>

    <section>
      <a href="/" class="font-zagoth h1">Vanadium</a>
    </section>

		<svelte:fragment slot="trail">
            <a href="/profile"><Icon icon="mdi:account-circle"/></a>
        </svelte:fragment>
	</AppBar>

    {#key data.url}
        <div class="flex-1 overflow-y-scroll" in:fly={{x:-200, duration:300, delay:300}} out:fly={{x:200, duration:300}}>
                <slot/>
        </div>
    {/key}

  <TabGroup 
    active="variant-filled-primary scale-150 -translate-y-4"
    hover="hover:variant-soft-primary"
    justify="justify-around overflow-x-visible"
    rounded=""
    border=""
    class="bg-surface-100-800-token w-full p-2"
  >
	{#each sections as section}
        <TabAnchor class="rounded-full text-xl"  href={section.href} selected={$page.url.pathname === section.href}>
          {#if section.icon === 'custom:LogalSoce'}
            <LogalSoce className="w-6 h-6"/>
          {:else}
            <Icon icon={section.icon} />
          {/if}
        </TabAnchor>
			{/each}
	</TabGroup>
</div>
