<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import { page } from "$app/stores";
  import { TabGroup, TabAnchor } from "@skeletonlabs/skeleton";
  import LogalSoce from "$lib/components/svgs/logal-soce.svelte";
  import OneSignal from "@nolanx/svelte-onesignal";
  import { fly } from "svelte/transition";
  import { onDestroy, onMount } from "svelte";
  import type { boquettes } from "@prisma/client";
  import type { User } from "$lib/server/auth";
  import type { WithRequiredOnly } from "$lib/utils";

  export let USER: User | null;
  export let BOQUETTES_IDS: WithRequiredOnly<boquettes, 'id_boquette'>[];
  export let url: string | null;

  onMount(async () => {
    await OneSignal.init({
      appId: "8c47c8d7-2816-439b-8b07-59217c8431a6",
      autoResubscribe: true,
      allowLocalhostAsSecureOrigin: true,
    });

    if(USER && USER.pg.solde < 0){
      const unsubscribe = page.subscribe(($page) => {
        const audio =  new Audio('/sounds/flipcard.mp3')
        audio.currentTime = 0;
        audio.play().catch((e) => console.error('Playback failed', e));
      });
      onDestroy(unsubscribe);
    }
  });

  const title = "Vanadium";

  type BoquetteIconMap = {
    [key: number]: string;
  };

  let showBoquettes = false;

  const sections = [
    { icon: "mdi:event-note", href: "/rhopses" },
    { icon: "mdi:bar-chart", href: "/stats" },
    { icon: "custom:LogalSoce", href: "/" },
    { icon: "mdi:picture-360-outline", href: "/photos" },
    { icon: "mdi:payment", href: "/rechargement" },
  ];

  const boquettesIcons: BoquetteIconMap = {
    1: "mdi:food-croissant",
    2: "mdi:beer-outline",
    3: "mdi:cheese",
    4: "mdi:whatshot",
    5:"hugeicons:suit-01",
    7: "healthicons:alcohol-cessation",
    8: "mdi:tshirt-crew",
    14: "game-icons:tacos",
    17: "mdi:chips",
    20: "tabler:coin-euro",
    143: "mdi:glass-cocktail",
    147: "mdi:home-off",
    193: "mdi:food",
    195: "mdi:pizza",
    196: "mdi:egg",
    197: "mdi:salt",
    223: "noto:castle",
    1111:"game-icons:bowie-knife"
  };

  let boquettes_panel: HTMLElement;

  function handleClick(e: Event) {
    const target = e.target as HTMLElement;
    if (showBoquettes && !boquettes_panel.contains(target)) {
      showBoquettes = false;
    }
  }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:click={handleClick}
  class="relative overflow-hidden w-screen h-screen flex flex-col justify-between"
>
  <AppBar
    background=""
    border=""
    gridColumns="grid-cols-3"
    slotTrail="place-content-end text-4xl"
  >
    <svelte:fragment slot="lead">
      <span class="flex items-end gap-4">
        {#if BOQUETTES_IDS.length <= 2}
          {#each BOQUETTES_IDS as boq}
            <a class="text-3xl" href="/boquette-{boq.id_boquette}">
              <Icon
                icon={boquettesIcons[boq.id_boquette] ?? "carbon:unknown"}
              />
            </a>
          {/each}
        {:else}
          <div
            bind:this={boquettes_panel}
            class:card={showBoquettes}
            class:variant-filled-surface={showBoquettes}
            class="boquettes_panel absolute z-10 p-1 left-2 top-2 card flex flex-col items-center gap-4"
          >
            <button
              on:click={() => (showBoquettes = !showBoquettes)}
              class="btn-icon text-4xl"
            >
              <Icon icon="mdi:arrow-down-box" />
            </button>

            {#if showBoquettes}
              {#each BOQUETTES_IDS as boq}
                <a class="text-3xl" href="/boquette-{boq.id_boquette}">
                  <Icon
                    icon={boquettesIcons[boq.id_boquette] ?? "carbon:unknown"}
                  />
                </a>
              {/each}
            {/if}
          </div>
        {/if}
      </span>
    </svelte:fragment>
    <!-- Vanadium, Petibom, Tartopum -->
    <section class="flex justify-center">
      <a href="/" class="font-zagoth h1 whitespace-nowrap">{title}</a>
    </section>

    <svelte:fragment slot="trail">
      {#if USER}
        <a href="/profile"><Icon icon="mdi:account-circle" /></a>
      {:else}
        <a href="/login"><Icon icon="mdi:login" /></a>
      {/if}
    </svelte:fragment>
  </AppBar>

  {#key url}
    <div
      class="flex-1 overflow-y-scroll flex flex-col items-center"
      in:fly={{ x: -200, duration: 300, delay: 300 }}
      out:fly={{ x: 200, duration: 300 }}
    >
      <slot />
    </div>
  {/key}

  {#if USER != null}
    <TabGroup
      active="variant-filled-primary scale-150 -translate-y-4"
      hover="hover:variant-soft-primary"
      justify="justify-around overflow-x-visible"
      rounded=""
      border=""
      class="bg-surface-100-800-token w-full p-2"
    >
      {#each sections as section}
        <TabAnchor
          class="rounded-full text-xl"
          href={section.href}
          selected={$page.url.pathname === section.href}
        >
          {#if section.icon === "custom:LogalSoce"}
            <LogalSoce className="w-6 h-6" />
          {:else}
            <Icon
              icon={section.icon}
              fill-opacity={section.href == "/usins" && USER.pg.proms != 223
                ? "0.2"
                : "1"}
            />
          {/if}
        </TabAnchor>
      {/each}
    </TabGroup>
  {/if}
</div>
