<script lang="ts">
  import Rhopse from "$lib/components/boquette/Rhopse.svelte";
  import Produits from "$lib/components/boquette/Produits.svelte";
  import Actions from "$lib/components/boquette/Actions.svelte";
  import type { boquettes, pg } from '@prisma/client'
  import Logout from '$lib/components/svgs/logout.svelte';
  import BoquetteProfile from "$lib/components/profiles/BoquetteProfile.svelte";
  import Bolt from "$lib/components/svgs/bolt.svelte";
  import Popup from "$lib/components/miscellaneous/Popup.svelte";
  
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

  let special:string|null = null;
  $ : {
    if(data.id_boquette == 7) special = `boquette-${data.id_boquette}/special/foys` // Foys
    else if(data.id_boquette == 3) special = `boquette-${data.id_boquette}/special/auberge` // Auberge
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
    
    if (cachedData != null && cachedData !== 'undefined' && cachedData.length != 0) {
      // Load data from cache if available
      console.log('loading cache')
      return JSON.parse(cachedData);
    } else {
      console.log('fetching pgs')
      // Fetch data from server if not available in cache
      const response = await fetch(`/boquette-${boquette.id_boquette}/boquettePgs`, {method:"get"});
      const { pgs: fetchedPgs } = await response.json();
      console.log(fetchedPgs)
      // Cache the data
      localStorage.setItem('cachedPgs', JSON.stringify(fetchedPgs));
      return fetchedPgs;
    }
  };
</script>

<Popup bind:form={form}/>

<div class="w-11/12 flex flex-col gap-5 mt-5 mb-5">
  <BoquetteProfile boquette={boquette}>
    <form method="POST" action="/login?/logout">
      <input type="hidden" name="boquette" value={data.id_boquette}>
      <button class="w-8 absolute top-3 left-3">
        <Logout />
      </button>
    </form>
    <div class="flex absolute top-3 right-3 gap-2">
      {#if special != null}
        <a href={special} class="w-8">
          <Bolt/>
        </a>
      {/if}
    </div>
    
  </BoquetteProfile>
  <Actions boquette={boquette} categories={data.categories} products={data.produits}/>
  {#await pgsPromise()}
    Chargement des Rhopses
  {:then pgs} 
    <Rhopse pgs={pgs} boquette={boquette}></Rhopse>
  {/await}
  
  <Produits categories={data.categories} produits={data.produits}/>

    <!-- <CreerCategorieEtProduit categories={data.categories} id_boquette={data.id_boquette}/> -->
</div>


