<script lang="ts">
  import Rhopse from "$lib/components/boquette/Rhopse.svelte";
  import Produits from "$lib/components/boquette/Produits.svelte";
  import Actions from "$lib/components/boquette/Actions.svelte";
  import type { boquettes, pg } from '@prisma/client'
  import Logout from '$lib/components/svgs/logout.svelte';
  import BoquetteProfile from "$lib/components/boquette/BoquetteProfile.svelte";
  import Popup from "$lib/components/miscellaneous/Popup.svelte";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
  import {importExcel, exporterProduits, generateExcel} from "$lib/components/boquette/ExportImportFeuilleRhopses";
    import Icon from "@iconify/svelte";
    import ImportFeuilleRhopses from "$lib/components/boquette/ImportFeuilleRhopses.svelte";
  
  export let data;
  export let form:{success:boolean, message:string};

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

  const pgsPromise = async():Promise<Partial<pg>[]>=>{
    const cachedData = localStorage.getItem('cachedPgs');
    console.log(cachedData);
    try {
      if (cachedData != null && cachedData !== 'undefined' && cachedData.length != 0) {
        console.log('loading cache')
        const {value,expiry} = JSON.parse(cachedData) as {value:Partial<pg>[], expiry:number};

          if(new Date().getTime() > expiry){
          localStorage.removeItem('cachedPgs')
        } else {
          return value;
        }
      } 
    } catch{
      console.log('error with localstorage')
    }
    

    console.log('fetching pgs')
    const updateKey = localStorage.getItem('update_key');
    const response = await fetch(`/boquette-${boquette.id_boquette}/boquettePgs?update_key=` + updateKey, {method:"get"});
    const { pgs: fetchedPgs} = await response.json();

    // Cache the data
    const now = new Date();
    localStorage.setItem('cachedPgs',
      JSON.stringify(
        {
        'value':fetchedPgs,
        'expiry': now.getTime() + 30 * 60 * 1000 // 30 minutes in milliseconds
        }
      )
    );
    return fetchedPgs;
  };
</script>

<Popup bind:form={form}/>

<div class="w-11/12 flex flex-col gap-5 mt-5 mb-5">
  <BoquetteProfile {boquette}>
    <form method="POST" action="/login?/logout">
      <input type="hidden" name="boquette" value={data.id_boquette}>
      <button class="w-8 absolute top-3 left-3">
        <Logout />
      </button>
    </form>
  </BoquetteProfile>
  {#await pgsPromise()}
    Chargement des Rhopses
  {:then pgs}
  <div class="btn-group self-center w-fit variant-filled-secondary divide-gray-400">
    <button on:click={()=>generateExcel(data.produits)}>
      <Icon icon="fluent-mdl2:generate"/>
    </button>
    <ImportFeuilleRhopses id_boquette={data.id_boquette} {pgs}/>
    <button on:click={()=>exporterProduits(boquette, data.produits, data.categories)}>
      <Icon icon="mdi:export-variant"/>
    </button>
    {#if boquette.nom == "K've"}
      <a href="/boquette-{boquette.id_boquette}/editproducts">
        <Icon icon="mdi:edit"/>
      </a>
    {/if}
    <a href="/boquette-{boquette.id_boquette}/consommations">
      <Icon icon="mdi:event-note"/>
    </a>
  </div>
    <div class="card variant-filled-secondary">

    </div>
    <Rhopse {pgs} {boquette}></Rhopse>
  {/await}
  
  <Produits categories={data.categories} produits={data.produits}/>

    <!-- <CreerCategorieEtProduit categories={data.categories} id_boquette={data.id_boquette}/> -->
</div>


