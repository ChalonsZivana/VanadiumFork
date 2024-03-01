<script lang="ts">  
  import SectionCard from "$lib/components/section_card.svelte";
  import MyButton from "$lib/components/utils/MyButton.svelte";
  import type {Boquette} from './+page.server';
  import type { categories, produits } from "@prisma/client";

  export let data;
  let boquette:Boquette|null = null;
  let categorie:categories|null = null;
  let product:produits|null = null;

  const buttonClass = "bg-white text-black w-80 rounded-md";
  const choicesContainerClass = "flex flex-col max-h-96 gap-1 overflow-x-hidden overflow-y-auto"
</script>


<div class="flex h-screen flex-col items-center gap-5">
  <div class="{(boquette!=null)?'h-10':'h-40'} duration-300"></div>
  
  <div class="w-5/6">
    <SectionCard title="Rhopses">
      <div class="p-3 rounded-md bg-amber-100">
        <p class="text-black">Tu peux te rhopser ici sur certains produits du Tabagn's !</p>
      </div>
      <div class="flex gap-5">
        {#each Object.entries(data.boquettes) as [boq_name, boq]}
          <MyButton value={boq.boquette.nom??''} callback={()=>{boquette=boq;categorie=null;product=null;}}/>
        {/each}
      </div>
    </SectionCard>
  </div>
  {#if boquette}
    <div class="w-5/6">
        <div class="w-80 flex flex-col items-center">
          <!-- Categories -->
          {#if categorie == null && product == null}
            <SectionCard title="{boquette.boquette.nom??''} | Catégories">
              <div class={choicesContainerClass}>
                {#each boquette.categories as cat}
                  <button class={buttonClass} on:click={()=>categorie=cat}>
                  {cat.nom}
                  </button>
                {/each}
              </div>
            </SectionCard>
          {/if}
      
          <!-- Produits -->
          {#if categorie && product == null}
            <SectionCard title="{boquette.boquette.nom} | {categorie.nom} | Produits">
              <div class={choicesContainerClass}>
                {#each boquette.products as prod}
                  {#if prod.id_categorie == categorie.id_categorie}
                    <button class={buttonClass} on:click={()=>product=prod}>
                      {prod.nom}
                    </button>
                  {/if}
                {/each}
              </div>
              
            </SectionCard>      
          {/if}
      
          <!-- Validation -->
          {#if product}
            <SectionCard 
              title={`${data.session.user.pg.nums}Ch${data.session.user.pg.proms}`}>
              {#each boquette.products as prod}
                {#if prod.id_produit == product.id_produit}
                  {prod.nom}   -   {prod.prix}€
                {/if}
              {/each}
              <MyButton value="RHOPSER"></MyButton>
            </SectionCard>
          {/if}
      
          <button class="w-10" on:click={()=>{boquette=null;product=null;categorie=null;}}>
            <img src="\svgs\reset-svgrepo-com.svg" alt="" srcset="">
          </button>
        </div>
      </div>
  {/if}
  
</div>
