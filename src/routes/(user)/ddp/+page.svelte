<script lang="ts">
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
  import Special from "$lib/components/miscellaneous/Special.svelte";
  import MoneyColor from "$lib/components/miscellaneous/MoneyColor.svelte";
  import FullSearch from "$lib/components/search/consommations/FullSearch.svelte";
  import Negats from "$lib/components/pg/Negats.svelte";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";

  export let data;

  let currData: typeof data.search;
  $: currData = data.search;
  $: nombrePages = currData ? Math.ceil(currData.totalCons / 100) : undefined;

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email);
  }

  let promo = data.USER.pg.proms;

	function telechargerExcel() {
		const url = `/api/ddpSoldeProms/?promo=${encodeURIComponent(promo)}`;
		const a = document.createElement('a');
		a.href = url;
		a.download = `Solde_Promo_${promo}.xlsx`;
		a.click();
	}
  
</script>

<div class="w-11/12 mt-5 mb-5">
  <Negats negats={data.negats} />
  <button on:click={telechargerExcel} class="bg-red-600 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-full">Télécharger Excel</button>
</div>

<div class="w-11/12 card m">
  <Accordion>
    <AccordionItem>
      <svelte:fragment slot="summary">
        <p class="font-zagoth text-center text-3xl">Proms {data.proms}</p>
      </svelte:fragment>
      <svelte:fragment slot="content">
        <div class="h-96 overflow-y-scroll">
          <CustomTable
            elements={data.pgs}
            headers={["PG", "Bucque", "Solde", "Email"]}
          >
            <tr class="text-xxs" slot="tbody" let:e>
              <th class="p-2">
                <Special special={[11, 89, 111].includes(e.nums ?? -1)}>
                  {e.nums}Ch{e.proms}
                </Special>
              </th>
              <td class="max-w-24">{e.bucque}</td>
              <td>
                {#key e.solde}
                  <MoneyColor auto={e.solde} className="text-xs font-bold" />
                {/key}
              </td>
              <td>
                {#if e.email != ""}
                  <button
                    on:click={() => copyEmail(e.email)}
                    class="p-2 bg-blue-500 active:bg-blue-400 text-white"
                    >copier email</button
                  >
                {:else}
                  <p>email absent</p>
                {/if}
              </td>
            </tr><tr />
          </CustomTable>
        </div>
      </svelte:fragment>
    </AccordionItem>
  </Accordion>
</div>

<div class="w-11/12 mt-5">
  {#await currData?.consommations}
    Chargement Historique Général
  {:then consommations}
    <FullSearch
      fromOption={true}
      cancelOption={false}
      title="< Historique Général >"
      totalCons={currData?.totalCons ?? undefined}
      {nombrePages}
      consommations={consommations ?? []}
      page={currData?.page ?? 1}
      types={{ "Opérations PG": "pg_boq", "Opérations Taferie": "ext_boq" }}
    >
      <svelte:fragment slot="proms">
        <input type="hidden" name="proms" value={data.proms} />
        <input disabled class="w-32" type="number" value={data.proms} />
      </svelte:fragment>
    </FullSearch>
  {/await}
</div>
