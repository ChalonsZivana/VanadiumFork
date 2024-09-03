<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
  import Accept from "$lib/components/svgs/accept.svelte";
  import {enhance} from '$app/forms'
  import SubmitDialog from "$lib/components/miscellaneous/SubmitDialog.svelte";
  import ValidationButton from "$lib/components/miscellaneous/ValidationButton.svelte";

  export let data;
  export let editDialog:HTMLDialogElement;

  function getProducts(id_categorie:number){
    return data.produits.filter(e=>e.id_categorie==id_categorie);
  }

  function editProduct(product:typeof data.produits[0]){
    productToEdit = product;
    editDialog.showModal()
  }

  function toggleAnimate(id_produit:number){
    document.getElementById('produit-'+id_produit)?.classList.toggle('animate-background-shine')
  }

  let productToEdit:typeof data.produits[0] | null = null;
  let id_categorie:null|number = null;

  $:prodsByCategorie = data.categories.map(e => ({
      categorie:e,
      products:getProducts(e.id_categorie)
    }))
</script>

<div class="w-11/12 mt-5 flex flex-col gap-5">
  <SectionCard title="Ajouter Produit">
    <form class="w-full flex flex-col gap-5" use:enhance action="?/addProduct" method="post">
      <label>
        <p class="text-3xl font-zagoth">Nom</p>
        <input required class="w-full text-xl pl-2 h-10 text-black" type="text" name="nom" id="">
      </label>
      <label class="flex flex-col gap-2">
        <p class="text-3xl font-zagoth">Catégorie</p>
        <select class="w-full h-10 text-black" name="id_categorie" bind:value={id_categorie}>
          <option value={null}>Nouvelle catégorie</option>
          {#each data.categories as cat}
            <option value={cat.id_categorie}>{cat.nom}</option>
          {/each}
        </select>
        {#if id_categorie == null}
          <input required class="text-black text-xl pl-2 w-full h-10" type="text" name="nom_categorie" placeholder="nouvelle catégorie" id="">
        {/if}
      </label>
      <label>
        <p class="text-3xl font-zagoth">Prix</p>
        <input required class="w-full text-xl pl-2 h-10 text-black" type="number" step="0.01" min="0" name="prix">
      </label>
      
      <button class="rounded-md bg-blue-600 self-center">
        <Accept className="size-10"/>
      </button>
    </form>
  </SectionCard>

  <SectionCard title="Produits">
    <div class="flex flex-col font-bold gap-2 w-full">
      {#each prodsByCategorie as prodcat}
          <p class="text-center text-3xl">{prodcat.categorie.nom!=''?prodcat.categorie.nom:'catégorie sans nom'}</p>
          {#if prodcat.products.length == 0}
            <form use:enhance method="post">
              <input type="hidden" name="id_categorie" value={prodcat.categorie.id_categorie}>
              <ValidationButton formaction="?/deleteCategory" text="Supprimer catégorie"/>
            </form>
          {:else}
            <CustomTable elements={prodcat.products} headers={['Produit','Prix']}>
              <svelte:fragment slot="tbody" let:e>
                  <tr id="produit-{e.id_produit}" class="w-full" on:animationend={()=> toggleAnimate(e.id_produit)}>
                    <td class="h-10">
                      <button class="w-full h-full" on:click={()=>editProduct(e)}>{e.nom}</button>
                    </td>
                    <td class="flex items-center w-20 h-10">
                      <button class="w-full h-full" on:click={()=>editProduct(e)}>{e.prix}€</button>
                    </td>
                  </tr>
              </svelte:fragment>
            </CustomTable>
          {/if}
          
      {/each}
    </div>
  </SectionCard>
</div>

<input type="hidden" name="" class="animate-background-shine">


<SubmitDialog customEnhance={()=>{return ({update})=>update({reset:false})}} onsubmit={()=>toggleAnimate(productToEdit?.id_produit??0)} bind:dialog={editDialog} buttonText="Editer" formAction="?/editProduct" title="Edition Produit">
  {#if productToEdit}

  <div class="flex flex-col h-96 justify-around">
      <input type="hidden" name="id_produit" value={productToEdit.id_produit}>
      <label>
        <p class="text-2xl font-zagoth text-white">Catégorie du produit:</p>
        <select class="h-10 w-full" name="id_categorie" value={productToEdit.id_categorie}>
          {#each data.categories as cat}
            <option value={cat.id_categorie}>{cat.nom}</option>
          {/each}
        </select>
      </label>
      <label>
        <p class="text-2xl font-zagoth text-white">Nom du produit:</p>
        <input class="pl-2 h-10 w-full" type="text" name="nom" value={productToEdit.nom}>
      </label>
      <label>
        <p class="text-2xl font-zagoth text-white">Prix du produit:</p>
        <input class="pl-2 h-10 w-full" type="number" step="0.01" min="0" name="prix" value={productToEdit.prix}>
      </label>

      <ValidationButton formaction="?/deleteProduct" text="Supprimer produit"/>
  </div>

  {/if}
</SubmitDialog>
