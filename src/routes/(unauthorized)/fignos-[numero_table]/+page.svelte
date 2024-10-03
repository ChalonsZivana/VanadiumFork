

<script lang="ts">
  import SectionCard from '$lib/components/SectionCard.svelte';
  import SubmitDialog from '$lib/components/miscellaneous/SubmitDialog.svelte';
  import MyButton from '$lib/components/miscellaneous/MyButton.svelte';
  import type { categories, pg, produits } from '@prisma/client';
  import type { SubmitFunction } from "@sveltejs/kit";
  import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';


  export let data;
  

  export let dialog:HTMLDialogElement;

  const quantités = Object.fromEntries(data.produits.map(e=>[e.id_produit, 0]))
  let categorie = data.categories[0];
  $: products = categorie ? getProducts(categorie.id_categorie) : [];
  $: selectedProducts = data.produits.filter(e=>quantités[e.id_produit]>0)

  function getProducts(id_categorie:number){
    return data.produits.filter(e=>e.id_categorie==id_categorie);
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

  onMount(()=>{
    setInterval(()=>{
      fetch('')
    },5000);
  })
</script>


<div class="h-full w-full">
  <SectionCard title="Commandes - Table {data.numero_table}">
    {#if selectedProducts.length}
    <div class="w-full flex flex-col gap-2 text-black">
        <div class="flex flex-col gap-1">
          {#each selectedProducts as product, i}
            <div class="animate-scale-up p-1 bg-red-100 rounded-3xl overflow-clip">
              <p class="bg-red-100 text-center font-bold">
                {product.nom}     ({product.prix + product.prix2}€)
              </p>
              <div class="flex justify-center gap-1">
                <button on:click={()=>increment(product.id_produit,-1)} class="w-10"><Icon icon="mdi:minus-box" /></button>
                <input required on:change={()=>verifyPositivity(product.id_produit)} class="text-center rounded-lg w-20" type="number" min=0 bind:value={quantités[product.id_produit]}>
                <button on:click={()=>increment(product.id_produit,1)} class="w-10"><Icon icon="mdi:plus-box" /></button>
              </div>
            </div>
          {/each}
        </div>
        <div class="flex justify-center"><MyButton value="COMMANDER" callback={()=>dialog.showModal()}/></div>
    </div>
    {/if}
    {#if data.categories.length > 1}
      <select class="text-black w-full  p-2 text-xl rounded-xl" bind:value={categorie}>
        {#each data.categories as cat}
          <option class="text-xs w-1/2" value={cat}>{cat.nom}</option>
        {/each}
      </select>
    {/if}
    <div class="h-96 text-black w-full overflow-y-scroll flex flex-col bg-red-100 rounded-md">
      {#each products as product, i}
        <div>
          <p class="bg-red-100 p-1 text-center font-bold">
            {product.nom}     ({product.prix + product.prix2}€)
          </p>
          <div class="flex justify-center gap-1 bg-red-100">
            <button on:click={()=>increment(product.id_produit,-1)} class="w-10"><Icon icon="mdi:minus-box" /></button>
            <input required on:change={()=>verifyPositivity(product.id_produit)} class="text-center rounded-lg w-20" type="number" min=0 bind:value={quantités[product.id_produit]}>
            <button on:click={()=>increment(product.id_produit,1)} class="w-10"><Icon icon="mdi:plus-box" /></button>
          </div>
        </div>
      {/each}
    </div>
  </SectionCard>

</div>

<SubmitDialog customEnhance={customEnhance} bind:dialog={dialog} formAction={"?/commande"} title="< Rhopser >" buttonText="Commander">
  <p class="font-zagoth text-3xl text-center text-white">Commander</p>

    <div class="rounded-3xl  overflow-clip mt-5">
      {#each selectedProducts as product, i}
        <div class="animate-scale-up divide-y-2 divide-black ">
          <div>
            <p class="bg-gray-300 text-center font-bold">
              {product.nom}     ({product.prix + product.prix2}€)
            </p>
            <div class="flex bg-slate-200 justify-center gap-1">
              {quantités[product.id_produit]}
            </div>
          </div>
        </div>
      {/each}
    </div>
</SubmitDialog>