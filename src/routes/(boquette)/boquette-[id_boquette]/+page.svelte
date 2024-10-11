<script lang="ts">
  import Rhopse from "$lib/components/boquette/Rhopse.svelte";
  import Produits from "$lib/components/boquette/Produits.svelte";
  import type { boquettes, pg } from '@prisma/client'
  import Logout from '$lib/components/svgs/logout.svelte';
  import BoquetteProfile from "$lib/components/boquette/BoquetteProfile.svelte";
  import Popup from "$lib/components/miscellaneous/Popup.svelte";
  import Actions from "$lib/components/boquette/Actions.svelte";
    import SectionCard from "$lib/components/SectionCard.svelte";
    import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
  
  export let data;
  export let form:{success:boolean, message:string};
  export let editDialog:HTMLDialogElement;

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
    <Actions {boquette} {pgs} categories={data.categories} produits={data.produits}/>   
    <Rhopse {pgs} {boquette}></Rhopse>
  {/await}

  <SectionCard title='Stats du jour'>
    <CustomTable elements={data.consommations_count} headers={['Produit','Total']}>
      <svelte:fragment slot="tbody" let:e>
        <tr id="produit-{e.id_produit}" class="w-full">
          <td class="h-10">{data.produits.find(e => e.id_produit == e.id_produit)?.nom}
          </td>
          <td class="flex items-center justify-center h-10">
            {e._count}
          </td>
        </tr>
    </svelte:fragment>
    </CustomTable>
  </SectionCard>
  
  <Produits id_boquette={data.id_boquette} editable={false} {editDialog} categories={data.categories} produits={data.produits}/>

    <!-- <CreerCategorieEtProduit categories={data.categories} id_boquette={data.id_boquette}/> -->
</div>


