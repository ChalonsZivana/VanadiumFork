<script lang="ts">
  import type { boquettes, categories, produits } from "@prisma/client";
  import ExcelJS from 'exceljs';
  import { download } from "./downloadExcel";

  export let boquette:boquettes;
  export let products:produits[];
  export let categories:categories[];

  async function exporterProduits(){
    const workbook = new ExcelJS.Workbook();
    const wsProducts = workbook.addWorksheet("Produits");
    let i = 1;
    categories.forEach((cat, j) => {
      wsProducts.mergeCells(1,j,1,j+1);
      wsProducts.getCell(1,j).value = cat.nom;
      j += 5;
      const prods = products.filter(e => e.id_categorie == cat.id_categorie);
      for(let prod of prods){
        wsProducts.getCell(i,j).value = prod.nom;
        wsProducts.getCell(i,j+1).value = prod.prix + prod.prix2;
        i += 1;
      }
    });
    const date = new Date();
    const nom = `${boquette.nom_simple}-produits-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}.xlsx`
    download(workbook, nom);
  }
</script>

<button on:click={exporterProduits} class="bg-blue-600 p-2 relative flex justify-center items-center w-2/5 rounded-md">      
  <p>Exporter produits</p>
</button>