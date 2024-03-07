<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import Rhopse from "$lib/components/sections/boquette/Rhopse.svelte";
  import Produits from "$lib/components/sections/boquette/Produits.svelte";
  import Parametres from "$lib/components/sections/boquette/Parametres.svelte";
  import CreerCategorieEtProduit from "$lib/components/sections/boquette/CreerCategorieEtProduit.svelte";
  import GenererFeuilleRhopse from "$lib/components/miscellaneous/GenererFeuilleRhopse.svelte";

  export let data;
  $: boquette = data.session.boquettes.find(e=>e.id_boquette == data.id_boquette) ?? data.session.boquettes[0];
</script>


<div class="w-11/12 flex flex-col gap-5">
  <SectionCard title={boquette.nom??''}>
    <div class="w-full flex flex-col text-white">
      <p>-200</p>
      <p>Identifiant: {boquette.nom_simple}</p>
    </div>
    <GenererFeuilleRhopse products={data.produits}/>
  </SectionCard>
  <SectionCard title="Historique"></SectionCard>

  <Parametres boquette={boquette}></Parametres>

  <Rhopse pgs={data.pgs}></Rhopse>
  <Produits categories={data.categories} produits={data.produits}></Produits>
  <CreerCategorieEtProduit categories={data.categories}></CreerCategorieEtProduit>
</div>
