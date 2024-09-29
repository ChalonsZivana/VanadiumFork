<script lang="ts">
  import type { boquettes, categories, produits } from "@prisma/client";
  import ExcelJS from 'exceljs';
  import { download } from "./downloadExcel";

  export let products:produits[];

  async function generateExcel() {
    const workbook = new ExcelJS.Workbook();
    const wsRhopses =  workbook.addWorksheet("Rhopses");
    const wsProducts = workbook.addWorksheet("Produits", {state:"hidden"});

    wsProducts.getCell(1, 1).value = 'Produits';
    wsProducts.getCell(1, 2).value = 'Prix';
    for(let [i,prod] of products.entries()){
      wsProducts.getCell(2 + i, 1).value = prod.nom;
      wsProducts.getCell(2 + i, 2).value = prod.prix + prod.prix2;
      wsProducts.getCell(2 + i, 3).value = prod.id_produit;
    }

    wsRhopses.addTable({
      name: 'MyTable',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,
      style: {showColumnStripes: true},
      columns: [
        {name: 'PG', filterButton: false},
        {name: 'Produits', filterButton: false},
        {name: 'Quantité', filterButton: false},
        {name: 'Prix', filterButton: false, },
        {name: 'Commentaire', filterButton: false},
        {name: 'id_produit', filterButton:false}
      ],
      rows: Array.from({ length: 9999 }, (_, index) => {
        const rowIndex = index + 2; // Adding 2 because row indices start from 1 and there's a header row
        return [
          '', '', 1, 
          { formula: `VLOOKUP($B${rowIndex}, Produits!$A:$B, 2, FALSE) * MAX($C${rowIndex}, 1)` }, '', 
          { formula: `VLOOKUP($B${rowIndex}, Produits!$A:$C, 3, FALSE)` }
        ];
      }),
    });

    wsRhopses.getColumn('F').hidden = true;
    wsRhopses.getColumn('D').numFmt = "#,##0.00 €"
    wsRhopses.getColumn('B').width = 30;
    wsRhopses.getColumn('E').width = 30;
    wsRhopses.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'A2', activeCell: 'A2' }];
    //@ts-ignore
    wsRhopses.dataValidations.model['B2:B9999'] = {
      allowBlank: true,
      error: "Ce n'est pas un produit valide.",
      errorTitle: 'Produit invalide',

      formulae: ['Produits!A2:A9999'],
      showErrorMessage: true,
      type: 'list',
    };
    const date = new Date();
    const nom = `feuille_rhopses_${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}.xlsx`;
    download(workbook, nom);
}
</script>

<button on:click={generateExcel} class="bg-blue-600 p-2 relative flex justify-center items-center w-2/5 rounded-md">      
  <p>Générer feuille de rhopse</p>
</button>