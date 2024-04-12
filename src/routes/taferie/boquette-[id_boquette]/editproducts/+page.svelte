<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
  import Accept from "$lib/components/svgs/accept.svelte";
  import {enhance} from '$app/forms'
  import CustomDialog from "$lib/components/miscellaneous/CustomDialog.svelte";

  export let data;
  export let editDialog:HTMLDialogElement;

  function getProducts(id_categorie:number){
    return data.produits.filter(e=>e.id_categorie==id_categorie);
  }

  function editProduct(product:typeof data.produits[0]){
    productToEdit = product;
    editDialog.showModal()
  }

  let productToEdit:typeof data.produits[0] | null = null;
  let id_categorie:null|number = null;
  let toggleDeleteProduct = false;
</script>

<div class="w-11/12 mt-5 flex flex-col gap-5">
  <SectionCard title="Ajouter Produit">
    <form use:enhance action="?/addProduct" method="post">
      <label>
        <p class="text-3xl font-zagoth">Nom</p>
        <input required class="w-80 text-xl pl-2 h-10 text-black" type="text" name="nom" id="">
      </label>
      <label class="flex flex-col gap-2">
        <p class="text-3xl font-zagoth">Catégorie</p>
        <select class="w-80 h-10 text-black" name="id_categorie" bind:value={id_categorie}>
          <option value={null}>Nouvelle catégorie</option>
          {#each data.categories as cat}
            <option value={cat.id_categorie}>{cat.nom}</option>
          {/each}
        </select>
        {#if id_categorie == null}
          <input required class="text-black text-xl pl-2 w-80 h-10" type="text" name="nom_categorie" placeholder="nouvelle catégorie" id="">
        {/if}
      </label>
      <label>
        <p class="text-3xl font-zagoth">Prix</p>
        <input required class="w-80 text-xl pl-2 h-10 text-black" type="number" step="0.01" min="0" name="prix">
      </label>
      
      <button class="p-2 rounded-md">
        <Accept className="size-10"/>
      </button>
    </form>
  </SectionCard>

  <SectionCard title="Produits">
    <div class="flex flex-col font-bold gap-2 w-full">
      {#each data.categories as cat}
          <CustomTable title={cat.nom} elements={getProducts(cat.id_categorie)} headers={['Produit','Prix']}>
            <svelte:fragment slot="tbody" let:e>
                <tr class="w-full">
                  <td class="h-10">
                    <button class="w-full h-full" on:click={()=>editProduct(e)}>{e.nom}</button>
                  </td>
                  <td class="flex items-center w-20 h-10">
                    <button class="w-full h-full" on:click={()=>editProduct(e)}>{e.prix}€</button>
                  </td>
                </tr>
                
            </svelte:fragment>
          </CustomTable>
      {/each}
    </div>
  </SectionCard>
</div>


<CustomDialog bind:dialog={editDialog} buttonText="Editer" formAction="?/editProduct" title="Edition Produit">
  <div class="flex flex-col h-80 justify-around">
    {#if productToEdit}
      <input type="hidden" name="id_produit" value={productToEdit.id_produit}>
      <label>
        <p class="text-2xl font-zagoth text-white">Nom du produit:</p>
        <input class="pl-2 h-10 w-full" type="text" name="nom" value={productToEdit.nom}>
      </label>
      <label>
        <p class="text-2xl font-zagoth text-white">Prix du produit:</p>
        <input class="pl-2 h-10 w-full" type="number" step="0.01" min="0" name="prix" value={productToEdit.prix}>
      </label>




      <div class="mt-5 rounded-lg overflow-clip w-full text-white">
        <button type="button" on:click={()=>toggleDeleteProduct=!toggleDeleteProduct} class="bg-red-700 font-zagoth text-2xl p-2 w-full">
          Supprimer produit
        </button>
        <div class="flex text-white {toggleDeleteProduct?'h-10 scale-y-100':'h-0 scale-y-0'} origin-top duration-300">
          <button formaction="?/deleteProduct" class="bg-green-600 w-full flex justify-center" on:click={()=>toggleDeleteProduct=false}>
            <Accept className="w-10 p-1"/>
          </button>
        </div>
      </div>
      
    {/if}
  </div>
</CustomDialog>
