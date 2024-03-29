<script lang="ts">
  import type { boquettes } from '@prisma/client'
  import FullSearch from "$lib/components/search/FullSearch.svelte";

  export let data;

  export let form:{consommations:typeof data.consommations, page:number, totalCons:number};

  $: consomms =form ?  form.consommations : data.consommations;
  $: page = form ? form.page : 1;
  $: totalCons = form ? form.totalCons : data.totalCons;
  $: nombrePages =Math.ceil(totalCons / 100);

  let boquette:boquettes;
  type boqSettingsText = {'Nom':string,'Nom Simple':string,'Nouveau Mot de passe':string,'Confirmation mot de passe :':string};
  type boqSettingsCheck = {'Partie PG':boolean};
  let editInputText:boqSettingsText;
  let editInputCheck:boqSettingsCheck;
  let editDataKeys: (keyof typeof editInputText)[];
  $:boquette = data.BOQUETTES.find(e=>e.id_boquette == data.id_boquette) ?? data.BOQUETTES[0];
  $: {
    editInputText = initPGEdit(boquette);
    editInputCheck = {'Partie PG':boquette.partie_pg};     
    editDataKeys = Object.keys(editInputText) as (keyof typeof editInputText)[];
  }

  function initPGEdit(boq:boquettes):boqSettingsText {
    return {
    'Nom':boq.nom ?? '',
    'Nom Simple':boq.nom_simple ?? '',
    'Nouveau Mot de passe':"",
    'Confirmation mot de passe :':""
    };
  }
</script>

<FullSearch 
  title="Historique" 
  totalCons={totalCons}
  nombrePages={nombrePages}
  consommations={consomms}
  page={page}
  types={{"Opérations PG":"pg_boq", "Opérations Taferie":"ext_boq"}}/>