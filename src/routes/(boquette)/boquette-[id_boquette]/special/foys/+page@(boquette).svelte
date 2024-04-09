<script lang="ts">
  export let data;
  import MyButton from '$lib/components/miscellaneous/MyButton.svelte';
  import type{categories, produits} from '@prisma/client';
  import Reset from '$lib/components/svgs/reset.svelte';
  
  let proms:number|null=null;
  const listProms = Object.keys(data.proms).map(e=>parseInt(e)).sort((a,b)=>a-b);
  
  let pg:{nums:number, id_pg:number}|null=null;
  const listNums =()=> data.proms[proms as keyof typeof data.proms].sort((a,b)=>a.nums-b.nums);
  const rhopse = () => {
    if(pg == null) return;
    fetch(`/boquette-${data.id_boquette}/rhopse-${pg.id_pg}?/rhopse`,
    {
      method:"post",
      body:JSON.stringify(
        {
          produits:[[product?.id_produit, 1]],
        }
      )
    });
    reset();
  }
  let categorie:categories|null;
  $:categorie = null;
  let product:produits|null = null;
  $: getProducts = data.products.filter(e=>e.id_categorie==categorie?.id_categorie);

  const reset = () => {pg=null;proms=null;product=null;categorie=null};
  const buttonClass = "bg-white h-14 text-black w-80 rounded-md";
  const choicesContainerClass = "mt-5 flex-grow w-full flex flex-col justify-center items-center gap-1"
  const coloredClass = "p-5 bg-fuchsia-500 text-4xl rounded-md"
</script>

<div class="h-full flex flex-col items-center p-1 text-white">
  <div class=" flex justify-center items-center">
    <p class="text-5xl font-zagoth mt-5">Rhopse Foy's</p>
  </div>
  
  {#if proms == undefined}
    <p class="text-3xl font-zagoth mt-5">Choix Prom's</p>
    <div class="mt-5 flex-grow w-full flex justify-center items-center gap-5">
      {#each listProms as p}
        <button on:click={()=>proms=p} class="h-28 aspect-square rounded-md bg-red-700">{p}</button>
      {/each}
    </div>
  {/if}
  
  
  {#if proms && pg == undefined}
    <p class="text-3xl font-zagoth mt-5">Choix Num's</p>
    <div class="mt-5 flex-grow w-full grid gap-1 grid-cols-10 grid-rows-[15]">
      {#each listNums() as n}
        <button on:click={()=>pg=n} class="aspect-square rounded-md bg-red-700">{n.nums}</button>
      {/each}
    </div>
  {/if}

  {#if pg && categorie == null}
    <p class="text-3xl font-zagoth mt-5">Choix Categorie</p>
    <div class={choicesContainerClass}>
      {#each data.categories as cat}
        <button class={buttonClass} on:click={()=>categorie=cat}>
        {cat.nom}
        </button>
      {/each}
    </div>
  {/if}

  {#if categorie && product == null}
    <p class="text-3xl font-zagoth mt-5">Choix Boisson</p>
    <div class={choicesContainerClass}>
      {#each getProducts as prod}
        <button class={buttonClass} on:click={()=>product=prod}>
          {prod.nom}
        </button>
      {/each}
    </div>
  {/if}
      
  <!-- Validation -->
  {#if product != null}
  <div class={choicesContainerClass}>
    <div class="text-4xl flex flex-col justify-center items-center gap-5">
      <p>Veux-tu rhopser</p>
      <div class="flex justify-center items-center text-4xl">
        {#key proms}
          <select bind:value={pg} class={coloredClass}>
            {#each listNums() as n}
              <option value="{n}">{n.nums}</option>
            {/each}
          </select>  
        {/key}      
        <p class="mr-2 ml-2">ch</p>
        <select bind:value={proms} class={coloredClass}>
          {#each listProms as n}
            <option value="{n}">{n}</option>
          {/each}
        </select> 
      </div>
      <p>pour un</p>
      <select bind:value={product} class="{coloredClass} w-80 text-center">
        {#each getProducts as n}
          <option value="{n}">{n.nom}</option>
        {/each}
      </select> 
      de la catégorie
      <select bind:value={categorie} class="{coloredClass} w-80 text-center">
        {#each data.categories as n}
          <option value="{n}">{n.nom}</option>
        {/each}
      </select> 
      
      <MyButton value="RHOPSER" callback={rhopse}></MyButton>
    </div>
      </div>
  {/if}

  <button class="w-14 mb-10" on:click={reset}>
    <Reset/>
  </button>
</div>