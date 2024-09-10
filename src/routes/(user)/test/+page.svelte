<script lang="ts">
	import { TabGroup, Tab, Table } from "@skeletonlabs/skeleton";
	import Icon from "@iconify/svelte"
  import type { ConsommationsIncludeType } from '$lib/server/classes/Taferie';
    import SectionCard from "$lib/components/SectionCard.svelte";
		import Top from "$lib/components/miscellaneous/Leaderboard.svelte";
    import SquareRightArrow from "$lib/components/svgs/square-right-arrow.svelte";

	export let data;
	
	const negats = Object.entries(data.negats);

	let tabSet: number = 0;
	function getFrom(e:ConsommationsIncludeType){
    if(e.type.startsWith('pg')){
      return `${e.from_pg?.nums}\rch\r${e.from_pg?.proms}`;
    }
    return 'EXT';
  }

  function getTo(e:ConsommationsIncludeType){
    switch(e.type){
      case 'ext_boq':
      case 'pg_boq':
        return e.to_boquette?.nom;
      case 'pg_ext':
        return 'EXT';
      case 'ext_fams':
      case 'pg_fams':
        return e.to_fams?.nums;
      case 'pg_pg':
        return 'PG';
    }
  }
</script>

<div class="h-full flex flex-col">
	<TabGroup class="size-full" regionPanel="size-full">
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<div class="size-full flex flex-col justify-around items-center">
						<!-- Profile card -->
					<div class="card relative aspect-video w-11/12 max-w-80 p-4  bg-gradient-to-t from-primary-500 to-primary-400">
						<section class="p-4 relative">
							<div class="flex flex-col">
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
						<!-- Responsive Container (recommended) -->
						<div class="table-container w-11/12 flex-grow mb-20">
							<!-- Native Table Element -->
							<table class="table table-hover">
								<thead>
									<tr>
										<th class="text-xs">Date</th>
										<th class="text-xs">Vers</th>
										<th class="text-xs">Libelle</th>
										<th class="text-xs">Montant</th>
									</tr>
								</thead>
								<tbody>
									{#await data.consommations}
										...
									{:then consommations} 
										{#each consommations as conso}
											{@const date = conso.date_conso.toLocaleString().split(' ')}
											<tr>
												<td><span class="text-xs">{date[0]}<br>{date[1]}</span></td>
												<td><span class="text-xs table-cell-fit">{getTo(conso)}</span></td>
												<td>
													<div class="w-20 text-wrap">{conso.libelle}</div>
												</td>
												<td><span class="text-xs">{conso.montant}</span></td>
											</tr>
										{/each}
									{/await}
									
								</tbody>
							</table>
						</div>
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
