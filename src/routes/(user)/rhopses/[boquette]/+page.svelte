<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  export let data;
  
  let id_categorie:number|null = null;
  let id_produit:number|null = null;

  const buttonClass = "bg-white text-black w-80 rounded-md";
  const choicesContainerClass = "flex flex-col max-h-96 gap-1 overflow-x-hidden overflow-y-auto"
  
</script>


<div class="flex flex-col w-full h-full items-center justify-center">
  <p class="text-white font-zagoth text-6xl pb-10">Foy's</p>

  <div class="w-80 flex flex-col items-center">
    <!-- Categories -->
    {#if id_categorie == null && id_produit == null}
      <SectionCard title="Catégories">
        <div class={choicesContainerClass}>
          {#each data.categories as cat}
            <button class={buttonClass} on:click={()=>id_categorie=cat.id_categorie}>
            {cat.nom}
            </button>
          {/each}
        </div>
      </SectionCard>
    {/if}

    <!-- Produits -->
    {#if id_categorie && id_produit == null}
      <SectionCard title="Produits">
        <div class={choicesContainerClass}>
          {#each data.products as product}
            {#if product.id_categorie == id_categorie}
              <button class={buttonClass} on:click={()=>id_produit=product.id_produit}>
              {product.nom}
              </button>
            {/if}
          {/each}
        </div>
        
      </SectionCard>      
    {/if}

    <!-- Validation -->
    {#if id_produit}
      <SectionCard 
        title={`${data.session.user?.pg.nums}Ch${data.session.user?.pg.proms}`}>
        {#each data.products as product}
          {#if product.id_produit == id_produit}
            {product.nom}   -   {product.prix}€
          {/if}
        {/each}
      </SectionCard>
    {/if}

    <button class="w-10" on:click={()=>{id_produit=null;id_categorie=null;}}>
      <img src="\svgs\reset-svgrepo-com.svg" alt="" srcset="">
    </button>
  </div>
</div>

