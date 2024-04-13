<script lang="ts">
  import SectionCard from '$lib/components/SectionCard.svelte';
  import CustomDialog from '$lib/components/miscellaneous/CustomDialog.svelte';
  import MyButton from '$lib/components/miscellaneous/MyButton.svelte';
  import type { categories, pg, produits } from '@prisma/client';
  import AddSquare from '../svgs/add-square.svelte';
  import MinusSquare from '../svgs/minus-square.svelte';
  import type { SubmitFunction } from "@sveltejs/kit";

  export let rhopseUrl:string;
  export let pg:pg;
  export let produits:produits[];
  export let categories:categories[];
  

  export let dialog:HTMLDialogElement;

  const quantités = Object.fromEntries(produits.map(e=>[e.id_produit, 0]))
  let categorie = categories[0];
  $: products = getProducts(categorie.id_categorie)
  $: selectedProducts = produits.filter(e=>quantités[e.id_produit]>0)

  function getProducts(id_categorie:number){
    return produits.filter(e=>e.id_categorie==id_categorie);
  }
  function verifyPositivity(id_produit:number){
    if(quantités[id_produit] < 0) quantités[id_produit] = 0;
  }
  function increment(id_produit:number, qt:number){
    quantités[id_produit] += qt;
    verifyPositivity(id_produit);
  }
  const customEnhance:SubmitFunction<Record<string, unknown> | undefined, Record<string, unknown> | undefined> = ({formData}) => {
    formData.set('produits', JSON.stringify(selectedProducts.map(e=>[e.id_produit,quantités[e.id_produit]])))
  }
</script>


<div class="h-full w-full">
  <form action=""></form>
  <SectionCard title="Rhopse - {pg.nums}Ch{pg.proms}">
    {#if selectedProducts.length}
    <div class="w-full flex flex-col gap-2 text-black">
        <div class="flex flex-col gap-1">
          {#each selectedProducts as product, i}
            <div class="animate-scale-up p-1 bg-red-100 rounded-3xl overflow-clip">
              <p class="bg-red-100 text-center font-bold">
                {product.nom}     ({product.prix}€)
              </p>
              <div class="flex justify-center gap-1">
                <button on:click={()=>increment(product.id_produit,-1)} class="w-10"><MinusSquare /></button>
                <input on:change={()=>verifyPositivity(product.id_produit)} class="text-center rounded-lg w-20" type="number" min=0 bind:value={quantités[product.id_produit]}>
                <button on:click={()=>increment(product.id_produit,1)} class="w-10"><AddSquare /></button>
              </div>
            </div>
          {/each}
        </div>
        <div class="flex justify-center"><MyButton value="RHOPSER" callback={()=>dialog.showModal()}/></div>
    </div>
    {/if}
    {#if categories.length > 1}
      <select class="text-black w-full  p-2 text-xl rounded-xl" bind:value={categorie}>
        {#each categories as cat}
          <option class="text-xs w-1/2" value={cat}>{cat.nom}</option>
        {/each}
      </select>
    {/if}
    <div class="h-96 text-black w-full overflow-y-scroll flex flex-col bg-red-100 rounded-md">
      {#each products as product, i}
        <div>
          <p class="bg-red-100 p-1 text-center font-bold">
            {product.nom}     ({product.prix}€)
          </p>
          <div class="flex justify-center gap-1 bg-red-100">
            <button on:click={()=>increment(product.id_produit,-1)} class="w-10"><MinusSquare /></button>
            <input on:change={()=>verifyPositivity(product.id_produit)} class="text-center rounded-lg w-20" type="number" min=0 bind:value={quantités[product.id_produit]}>
            <button on:click={()=>increment(product.id_produit,1)} class="w-10"><AddSquare /></button>
          </div>
        </div>
      {/each}
    </div>
  </SectionCard>
</div>

<CustomDialog customEnhance={customEnhance} bind:dialog={dialog} formAction={rhopseUrl} title="< Rhopser >" buttonText="Rhopser">
  <p class="font-zagoth text-3xl text-center text-white">{pg.nums}Ch{pg.proms}</p>

    <div class="rounded-3xl  overflow-clip mt-5">
      {#each selectedProducts as product, i}
        <div class="animate-scale-up divide-y-2 divide-black ">
          <div>
            <p class="bg-gray-300 text-center font-bold">
              {product.nom}     ({product.prix}€)
            </p>
            <div class="flex bg-slate-200 justify-center gap-1">
              {quantités[product.id_produit]}
            </div>
          </div>
        </div>
      {/each}
    </div>
</CustomDialog>