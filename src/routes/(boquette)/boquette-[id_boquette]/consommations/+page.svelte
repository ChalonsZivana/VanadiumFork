<script lang="ts">
  import type { boquettes } from "@prisma/client";
  import FullSearch from "$lib/components/search/consommations/FullSearch.svelte";

  export let data;

  let currData: typeof data.search;
  $: currData = data.search;
  $: nombrePages = currData ? Math.ceil(currData.totalCons / 100) : undefined;

  type boqSettingsText = {
    Nom: string;
    "Nom Simple": string;
    "Nouveau Mot de passe": string;
    "Confirmation mot de passe :": string;
  };
  type boqSettingsCheck = { "Partie PG": boolean };
  let editInputText: boqSettingsText;
  let editInputCheck: boqSettingsCheck;
  let editDataKeys: (keyof typeof editInputText)[];
 
  $: {
    editInputText = initPGEdit(data.boquette);
    editInputCheck = { "Partie PG": data.boquette.partie_pg };
    editDataKeys = Object.keys(editInputText) as (keyof typeof editInputText)[];
  }

  function initPGEdit(boq: boquettes): boqSettingsText {
    return {
      Nom: boq.nom ?? "",
      "Nom Simple": boq.nom_simple ?? "",
      "Nouveau Mot de passe": "",
      "Confirmation mot de passe :": "",
    };
  }
</script>

<div class="w-11/12 mt-5">
  {#await currData?.consommations}
    Chargement Historique Général
  {:then consommations}
    <FullSearch
      fromOption={true}
      cancelOption={true}
      title="< Historique Général >"
      totalCons={currData?.totalCons ?? undefined}
      {nombrePages}
      {consommations}
      page={currData?.page}
      types={{ "Opérations PG": "pg_boq", "Opérations Taferie": "ext_boq" }}
    />
  {/await}
</div>
