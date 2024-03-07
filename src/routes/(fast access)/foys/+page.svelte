<script lang="ts">
  export let data;
  import MyButton from '$lib/components/miscellaneous/MyButton.svelte';
  import type{categories, produits} from '@prisma/client';
  
  let proms:number|null=null;
  const listProms = Object.keys(data.proms).map(e=>parseInt(e)).sort((a,b)=>a-b);
  
  let nums:number|null=null;
  const listNums =()=> data.proms[proms as keyof typeof data.proms].map(e=>e.nums).sort((a,b)=>a-b);

  let categorie:categories|null;
  $:categorie = null;
  let product:produits|null = null;
  $: getProducts = data.products.filter(e=>e.id_categorie==categorie?.id_categorie);

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
        <button on:click={()=>proms=p} class="h-28 aspect-square rounded-md bg-blue-700">{p}</button>
      {/each}
    </div>
  {/if}
  
  
  {#if proms && nums == undefined}
    <p class="text-3xl font-zagoth mt-5">Choix Num's</p>
    <div class="mt-5 flex-grow w-full grid gap-1 grid-cols-10 grid-rows-[15]">
      {#each listNums() as n}
        <button on:click={()=>nums=n} class="aspect-square rounded-md bg-blue-700">{n}</button>
      {/each}
    </div>
  {/if}

  {#if nums && categorie == null}
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
  {#if product}
  <div class={choicesContainerClass}>
    <div class="text-4xl flex flex-col justify-center items-center gap-5">
      <p>Veux-tu rhopser</p>
      <div class="flex justify-center items-center text-4xl">
        <select bind:value={nums} class={coloredClass}>
          {#each listNums() as n}
            <option value="{n}">{n}</option>
          {/each}
        </select>        
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
      
      <MyButton value="RHOPSER"></MyButton>
    </div>
    
      </div>
  {/if}

  <button class="w-10" on:click={()=>{nums=null;proms=null;product=null;categorie=null;}}>
    <img src="\svgs\reset-svgrepo-com.svg" alt="" srcset="">
  </button>
</div>