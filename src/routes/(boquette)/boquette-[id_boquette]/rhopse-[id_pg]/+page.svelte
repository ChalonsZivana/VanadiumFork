<script lang="ts">
  import SectionCard from '$lib/components/SectionCard.svelte';
  import CustomDialog from '$lib/components/miscellaneous/CustomDialog.svelte';
  import MyButton from '$lib/components/miscellaneous/MyButton.svelte';
  
  export let data;
  export let dialog:HTMLDialogElement;

  const quantités = Object.fromEntries(data.produits.map(e=>[e.id_produit, 0]))
  let categorie = data.categories[0];
  $: products = getProducts(categorie.id_categorie)
  $: selectedProducts = data.produits.filter(e=>quantités[e.id_produit]>0)

  function rhopser(){
    fetch('/api/actions/rhopse',
    {
      method:'POST',
      body:JSON.stringify(
        {
          id_boquette:data.id_boquette,
          id_pg:data.pg.id_pg,
          produits:selectedProducts.map(e=>[e.id_produit,quantités[e.id_produit]])
        }
      )
    });
    dialog.close();
  }

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
</script>

<div class="h-full w-11/12">
  <SectionCard title="Rhopse - {data.pg.nums}Ch{data.pg.proms}">
    {#if selectedProducts.length}
    <div class="w-full flex flex-col gap-2">
        <div class="flex flex-col gap-1">
          {#each selectedProducts as product, i}
            <div class="animate-scale-up p-1 bg-slate-300 rounded-3xl overflow-clip">
              <p class="bg-gray-300 text-center font-bold">
                {product.nom}     ({product.prix}€)
              </p>
              <div class="flex justify-center gap-1">
                <button on:click={()=>increment(product.id_produit,-1)} class="w-10"><img src="/svgs/minus-square.svg" alt="minus"></button>
                <input on:change={()=>verifyPositivity(product.id_produit)} class="text-center rounded-lg w-20" type="number" min=0 bind:value={quantités[product.id_produit]}>
                <button on:click={()=>increment(product.id_produit,1)} class="w-10"><img src="/svgs/add-square.svg" alt="plus"></button>
              </div>
            </div>
          {/each}
        </div>
        <div class="flex justify-center"><MyButton value="RHOPSER" callback={()=>dialog.showModal()}/></div>
    </div>
    {/if}
    <select class="w-80 p-2 text-xl rounded-xl" bind:value={categorie}>
      {#each data.categories as cat}
        <option class="text-xs w-1/2" value={cat}>{cat.nom}</option>
      {/each}
    </select>
    <div class="h-96 w-full overflow-y-scroll flex flex-col bg-slate-300 rounded-md">
      {#each products as product, i}
        <div>
          <p class="bg-gray-300 p-1 text-center font-bold">
            {product.nom}     ({product.prix}€)
          </p>
          <div class="flex justify-center gap-1 bg-slate-300">
            <button on:click={()=>increment(product.id_produit,-1)} class="w-10"><img src="/svgs/minus-square.svg" alt="minus"></button>
            <input on:change={()=>verifyPositivity(product.id_produit)} class="text-center rounded-lg w-20" type="number" min=0 bind:value={quantités[product.id_produit]}>
            <button on:click={()=>increment(product.id_produit,1)} class="w-10"><img src="/svgs/add-square.svg" alt="plus"></button>
          </div>
        </div>
      {/each}
    </div>
  </SectionCard>
</div>

<CustomDialog bind:dialog={dialog} title="< Rhopser >" buttonText="Rhopser" callback={rhopser}>
  <p class="font-zagoth text-3xl text-center text-white">{data.pg.nums}Ch{data.pg.proms}</p>

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