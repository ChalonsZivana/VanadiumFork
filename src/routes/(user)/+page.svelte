<script lang="ts">
  import { TabGroup, Tab } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import Top from "$lib/components/miscellaneous/Leaderboard.svelte";
  import ConsoTable from "$lib/components/search/ConsoTable.svelte";

  export let data;

  let tabSet: number = 0;
  let flipped = true;
  let photosIndex = 0;

  function flip() {
    if (!flipped && photosIndex < data.photos.length) {
      photosIndex += 1;
    }
    if (photosIndex == data.photos.length) {
      window.location.reload();
    } else {
      flipped = !flipped;
    }
  }

  let audioUrl = `data:audio/mp3;base64,${data.audioBase64}`;
  function playSound() {
		if (!audioUrl) return;
		let audio = new Audio(audioUrl);
		audio.play().catch((e) => console.error('Autoplay blocked', e));
	}
</script>


<div class="h-full flex flex-col overflow-y-hidden">
  <TabGroup class="size-full" regionPanel="size-full">
    <svelte:fragment slot="panel">
      {#if tabSet === 0}
        <!-- svelte-ignore a11y-media-has-caption -->
        <div
          class="size-full flex flex-col gap-4 pb-4 justify-around items-center"
        >
          <div class="size-full flex justify-center items-center">
            <button
              class="perspective-1000 relative {flipped
                ? 'aspect-square h-full max-w-80 max-h-80'
                : 'aspect-video w-80'} duration-1000"
              on:click={flip}
            >
              <div
                class={`relative size-full duration-1000 transform-style-3d ${flipped ? "rotate-y-180" : "rotate-y-0"}`}
              >
                <!-- Front face -->
                <div
                  class="absolute card w-full h-full bg-gradient-to-t from-primary-500 to-primary-400 flex items-center justify-center backface-hidden"
                >
                  <section class="relative w-full h-full flex items-center">
                    <div class="flex flex-col items-start p-4">
                      <span>Prénom: {data.USER.pg.prenom}</span>
                      <span>Nom: {data.USER.pg.nom}</span>
                      <span>Bucque: {data.USER.pg.bucque}</span>
                      <span>Proms: {data.USER.pg.proms}</span>
                      <span>Email: {data.USER.pg.email}</span>
                    </div>

                    <div
                      class="absolute font-zagoth opacity-50 right-0 top-0 text-9xl h-full flex justify-center items-center"
                    >
                      <span>{data.USER.pg.nums}</span>
                    </div>
                  </section>

                  {#if data.USER.pg.ddp}
                    <a href="ddp" class="absolute w-10 top-3 right-3">
                      <div class="p-1 border-1 border-white rounded-xl">
                        DDP
                      </div>
                    </a>
                  {/if}
                </div>
                <!-- Back face -->
                <div
                  class="absolute card p-1 w-full overflow-clip h-full bg-gradient-to-t from-primary-500 to-primary-400 flex items-center justify-center text-2xl font-bold backface-hidden rotate-y-180"
                >
                  <img
                    class="h-full w-full object-cover rounded-3xl"
                    src={data.photos[photosIndex]}
                    alt="Hot girl in swim bath."
                  />
                </div>
              </div>
            </button>
          </div>

          <div class="gap-6 flex flex-col w-80 flex-grow">
            {#if data.USER.pg.nums == 111 && data.USER.pg.proms == 224}
              <div class="relative w-full flex justify-center">
                <button class="absolute bottom-10" on:click={playSound}>
                  <Icon class="text-6xl" icon="twemoji:giraffe"/>
                </button>
              </div>
            {/if}
            <!-- Fonds -->
            <div class="card overflow-clip flex">
              <div class="flex justify-center items-center p-2 text-3xl">
                <Icon icon="tabler:coin-euro" />
              </div>

              <section class="grid grid-cols-2 w-full divide-x-[1px] p-2">
                <div class="flex flex-col justify-center items-center">
                  <p class="font-bold">PG</p>
                  <span>{data.USER.pg.solde}€</span>
                </div>
                <div class="flex flex-col justify-center items-center">
                  <p class="font-bold">Fam's</p>
                  <span>{data.USER.fams.solde}€</span>
                </div>
              </section>
            </div>
          </div>

          <div class="grid grid-cols-2 flex-grow mb-10">
            <button><!--use:soundButton>-->
              <Tab
                hover=""
                class="w-full"
                bind:group={tabSet}
                name="tab_stats"
                value={3}
              >
                <div
                  class="p-4 relative bg-secondary-hover-token card variant-filled-secondary flex justify-start items-center gap-4"
                >
                  <span><Icon icon="mdi:bar-chart" /></span>
                  <span>Stats</span>
                </div>
              </Tab>
            </button>

            <button><!--use:soundButton>-->
              <Tab hover="" bind:group={tabSet} name="tab_consos" value={1}>
                <div
                  class="p-4 relative bg-secondary-hover-token card variant-filled-secondary flex justify-start items-center gap-4"
                >
                  <span><Icon icon="mdi:event-note" /></span>
                  <span>Consos</span>
                </div>
              </Tab>
            </button>

            <button class="col-span-2"><!--use:soundButton>-->
              <Tab hover="" bind:group={tabSet} name="tab_consos" value={2}>
                <div
                  class="p-4 relative bg-secondary-hover-token card variant-filled-secondary flex justify-start items-center gap-4"
                >
                  <span><Icon icon="mdi:event-note" /></span>
                  <span>Historique Fams</span>
                </div>
              </Tab>
            </button>
          </div>
        </div>
      {:else if tabSet === 1}
        <div class="size-full flex flex-col items-center">
          <button><!--use:soundButton>-->
            <Tab hover="" bind:group={tabSet} name="tab_main" value={0}>
              <div
                class="p-4 bg-secondary-hover-token card variant-filled-secondary flex justify-start items-center gap-4"
              >
                <span><Icon icon="mdi:event-note" /></span>
                <span>Consos</span>
              </div>
            </Tab>
          </button>

          {#await data.consommations}
            <p>Chargement...</p>
          {:then consommations}
            <ConsoTable
              fromOption={false}
              cancelOption={false}
              {consommations}
            />
          {/await}
        </div>
      {:else if tabSet === 2}
        <div class="size-full flex flex-col items-center">
          <button><!--use:soundButton>-->
            <Tab hover="" bind:group={tabSet} name="tab_main" value={0}>
              <div
                class="p-4 bg-secondary-hover-token card variant-filled-secondary flex justify-start items-center gap-4"
              >
                <span><Icon icon="mdi:event-note" /></span>
                <span>Historique Fams</span>
              </div>
            </Tab>
          </button>

          {#await data.historique_fams}
            <p>Chargement...</p>
          {:then histo_fams}
            <ConsoTable
              fromOption={false}
              cancelOption={false}
              consommations={histo_fams}
            />
          {/await}
        </div>
      {:else if tabSet === 3}
        <div class="size-full flex flex-col items-center gap-4">
          <button><!--use:soundButton>-->
            <Tab hover="" bind:group={tabSet} name="tab_main" value={0}>
              <div
                class="p-4 bg-secondary-hover-token card variant-filled-secondary flex justify-start items-center gap-4"
              >
                <span><Icon icon="mdi:bar-chart" /></span>
                <span>Statistics</span>
              </div>
            </Tab>
          </button>

          <SectionCard title="Top Global">
            {#await data.topGlobal}
              Chargement top global...
            {:then top}
              <Top {top} />
            {/await}
          </SectionCard>
          {#await data.topDuJour}
            Chargement top global...
          {:then top}
            <SectionCard title={top.name}>
              <Top {top} />
              <a href="/stats">
                <Icon
                  class="w-10 text-3xl absolute top-2 right-2"
                  icon="mdi:arrow-right-bold-box"
                />
              </a>
            </SectionCard>
          {/await}
        </div>
      {/if}
    </svelte:fragment>
  </TabGroup>
</div>
