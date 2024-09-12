<script lang="ts">
	import { TabGroup, Tab } from "@skeletonlabs/skeleton";
	import Icon from "@iconify/svelte"
  import SectionCard from "$lib/components/SectionCard.svelte";
	import Top from "$lib/components/miscellaneous/Leaderboard.svelte";
  import ConsoTable from "$lib/components/search/ConsoTable.svelte";

	export let data;
	
	const negats = Object.entries(data.negats);

	let tabSet: number = 0;
	let flipped = true;
	let photosIndex = 0;
	

	function flip(){
		if(!flipped && photosIndex < data.photos.length){
			photosIndex += 1;
		}
		if(photosIndex == data.photos.length){
			window.location.reload();
		} else {
			flipped = !flipped;
		}
	}
</script>

<div class="h-full flex flex-col">
	<TabGroup class="size-full" regionPanel="size-full">
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
			 

			
				<div class="size-full flex flex-col justify-around items-center">
					<button class="perspective-1000 w-80 aspect-video max-w-80" on:click={flip}>
						<div class={`relative size-full duration-1000 transform-style-3d ${flipped ? 'rotate-y-180' : 'rotate-y-0'}`}>
								<!-- Front face -->
								<div class="absolute card w-full h-full bg-gradient-to-t from-primary-500 to-primary-400 flex items-center justify-center backface-hidden">
									<section class="p-4 relative">
										<div class="flex flex-col items-start">
											<span>Prénom: {data.USER.pg.prenom}</span>
											<span>Nom: {data.USER.pg.nom}</span>
											<span>Bucque: {data.USER.pg.bucque}</span>
											<span>Proms: {data.USER.pg.proms}</span>
											<span>Email: {data.USER.pg.email}</span>
										</div>
						
										<div class="absolute font-zagoth opacity-50 right-0 top-0 text-9xl h-full flex justify-center items-center">
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
								<div class="absolute card p-1 w-full h-full bg-gradient-to-t from-primary-500 to-primary-400 flex items-center justify-center text-2xl font-bold backface-hidden rotate-y-180">
									<img class="h-full w-full object-cover" src={data.photos[photosIndex]} alt="Hot girl in swim bath.">
							</div>					
						</div>
				</button>
			
					<div class="gap-10 flex flex-col w-80">
						<!-- Fonds -->
						<div class="card overflow-clip flex">
							<div class="flex justify-center items-center p-2 text-3xl">
								<Icon icon="tabler:coin-euro"/>
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
						<!-- Negats -->
						<div class="card overflow-clip flex">
							<div class="flex justify-center items-center p-2 text-3xl">
								<Icon icon="tabler:coin-euro"/>
							</div>
							<section class="grid grid-cols-2 w-full divide-x-[1px] p-2">
								{#each negats as [proms,negat]}
									<div class="flex flex-col justify-center items-center">
										<p class="font-bold">{proms}</p>
										<span>{negat}€</span>
									</div>
								{/each}
			
							</section>
						</div>
			
			
						<div class="grid grid-cols-2 gap-4">
							<Tab class="w-full"  bind:group={tabSet} name="tab_stats" value={2}>
								<div class="p-4 bg-secondary-hover-token card variant-filled-secondary flex justify-start items-center gap-4">
									<span><Icon icon="mdi:bar-chart" /></span>
									<span>Stats</span>
								</div>
							</Tab>
			
							<Tab  bind:group={tabSet} name="tab_consos" value={1}>
								<div class="p-4 bg-secondary-hover-token card variant-filled-secondary flex justify-start items-center gap-4">
									<span><Icon icon="mdi:event-note" /></span>
									<span>Consos</span>
								</div>
							</Tab>
						</div>
					</div>
				</div>
			{:else if tabSet === 1}
				<div class="size-full flex flex-col items-center">
					<Tab  bind:group={tabSet} name="tab_main" value={0}>
						<div class="p-4 bg-secondary-hover-token card variant-filled-secondary flex justify-start items-center gap-4">
							<span><Icon icon="mdi:event-note" /></span>
							<span>Consos</span>
						</div>
					</Tab>

					{#await data.consommations}
						<p>test</p>
					{:then consommations} 
					<ConsoTable fromOption={false} cancelOption={false} {consommations}/>

					{/await}
						
				</div>

			{:else if tabSet === 2}
			<div class="size-full flex flex-col items-center w-80 gap-4">
				<Tab  bind:group={tabSet} name="tab_main" value={0}>
					<div class="p-4 bg-secondary-hover-token card variant-filled-secondary flex justify-start items-center gap-4">
						<span><Icon icon="mdi:bar-chart" /></span>
						<span>Statistics</span>
					</div>
				</Tab>

				<SectionCard title="Top Global">
					{#await data.topGlobal}
						Chargement top global...
					{:then top} 
						<Top top={top}/>
					{/await}
				</SectionCard>
				{#await data.topDuJour}
					Chargement top global...
				{:then top} 
					<SectionCard title={top.name}>
						<Top top={top}/>
						<a href="/stats">
							<Icon class="w-10 text-3xl absolute top-2 right-2" icon="mdi:arrow-right-bold-box"/>
						</a>
					</SectionCard>
				{/await}
			</div>
			
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>
