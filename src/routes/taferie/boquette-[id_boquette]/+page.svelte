<script lang="ts">
  import BoquetteProfile from "$lib/components/boquette/BoquetteProfile.svelte";
  import FullSearch from "$lib/components/search/consommations/FullSearch.svelte";
  import Actions from "$lib/components/boquette/Actions.svelte";
  import GestionBrousouffs from "$lib/components/miscellaneous/GestionBrousouffs.svelte";
  import Popup from "$lib/components/miscellaneous/Popup.svelte";
  import Icon from "@iconify/svelte";
  import type{consommationsSearch} from '$lib/components/search/consommations/fullsearch.js'
    import { triggerPopupForm } from "$lib/stores/popupStore.js";

  export let data;
  export let form:{search:Awaited<ReturnType<typeof consommationsSearch>>, success:boolean, message:string};


  let currData:typeof data.search;
  $:currData = data.search;  
  $: nombrePages = currData ? Math.ceil(currData.totalCons / 100):NaN;

  $:triggerPopupForm(form);
</script>

<div class="w-11/12 flex flex-col pt-5 gap-5">
  <BoquetteProfile boquette={data.boquette} taferie={true}>
    <GestionBrousouffs/>
  </BoquetteProfile>

  <Actions boquette={data.boquette} categories={data.categories} produits={data.produits} pgs={null}>
    <a href="/taferie/boquette-{data.boquette.id_boquette}/editproducts">
      <Icon icon="mdi:edit"/>
    </a>
  </Actions>

    {#await currData?.consommations}
      Chargement Historique Général
    {:then consommations} 
      <FullSearch 
      fromOption={true}
      cancelOption={true}
      title="< Historique Général >" 
      totalCons={currData?.totalCons ?? undefined}
      nombrePages={nombrePages}
      consommations={consommations}
      page={currData?.page}
      types={{"Opérations PG":"pg_boq", "Opérations Taferie":"ext_boq"}}/>
    {/await}
  
 
</div>