<script lang="ts">
  import SectionCard from "$lib/components/section_card.svelte";
  import Rhopse from "$lib/components/sections/boquette/Rhopse.svelte";
  import Produits from "$lib/components/sections/boquette/Produits.svelte";
  import Parametres from "$lib/components/sections/boquette/Parametres.svelte";
  import MyButton from "$lib/components/utils/MyButton.svelte";
  import CreerCategorieEtProduit from "$lib/components/sections/boquette/CreerCategorieEtProduit.svelte";

  export let data;

  function getProducts(id_categorie:number){
    return data.produits.filter(e=>e.id_categorie==id_categorie);
  }
</script>


<div class="flex flex-col justify-center items-center">
  <div class="w-80 sm:w-8/12 flex flex-col gap-5">
    <SectionCard title="Auberge">
      <p>-200</p>
      <p>Identifiant: auberge</p>
      <MyButton value="Générer feuille de rhopse"/>
  
      <div class="bg-white text-black rounded-md">
        <input type="file" name="" id="">
      </div>
      <MyButton value="Importer feuille de rhopse"/>
    </SectionCard>
    <SectionCard 
      title="Historique"
      buttonHandle={()=> {}}
      buttonText="voir l'historique">
    </SectionCard>

    <Parametres boquette={data.boquette}></Parametres>
    
    <Rhopse pgs={data.pgs}></Rhopse>
    <Produits categories={data.categories} produits={data.produits}></Produits>
    <CreerCategorieEtProduit categories={data.categories}></CreerCategorieEtProduit>
  </div>
</div>