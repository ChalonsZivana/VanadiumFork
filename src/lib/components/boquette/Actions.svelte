<script lang="ts">
  import ExcelJS from 'exceljs';
  import type {boquettes, categories, produits} from '@prisma/client';
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte"
  import SectionCard from "$lib/components/SectionCard.svelte"
  import ToggleSectionCard from '../ToggleSectionCard.svelte';
    import MyButton from '../miscellaneous/MyButton.svelte';

  export let boquette:boquettes;
  export let products:produits[];
  export let categories:categories[];
  
  let importErrors: [string, boolean][][] = [];
  
  let fileInputRhopse:HTMLInputElement;

  async function download(workbook:ExcelJS.Workbook, nom:string){
    const buffer = await workbook.xlsx.writeBuffer();

    // Télécharger le fichier Excel
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nom;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async function generateExcel() {
    const workbook = new ExcelJS.Workbook();
    const wsRhopses =  workbook.addWorksheet("Rhopses");
    const wsProducts = workbook.addWorksheet("Produits", {state:"hidden"});
    

    wsProducts.getCell(1, 1).value = 'Produits';
    wsProducts.getCell(1, 2).value = 'Prix';
    for(let [i,prod] of products.entries()){
      wsProducts.getCell(2 + i, 1).value = prod.nom;
      wsProducts.getCell(2 + i, 2).value = prod.prix;
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

  async function importExcel(){
    const file = fileInputRhopse.files?.item(0);
    if(file == null) return;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const wsProms = workbook.getWorksheet(`Rhopses`);
    if(wsProms == null) return;
    let extractedData = (wsProms.getSheetValues() as any[]).map((e,i) => [i+1, e[1], e[2], e[3], e[6].result]);
    extractedData = extractedData.filter(e => e[1] != '' || e[2] != '');
    extractedData.shift();
    if(extractedData.length == 0) return;
    let lastKnown:string = extractedData[0][1];
    extractedData = extractedData.map(e => {
      const [ligne, pg, produit, _, __] = e;
      if(pg != '') lastKnown = pg.toLowerCase();
      const [nums, proms] = lastKnown.split('ch').map(e => parseInt(e));
      let [quantite, id_produit] = [parseInt(e[3]), parseInt(e[4])];
      quantite = isNaN(quantite) ? 1 : quantite

      if(isNaN(nums) || isNaN(proms) || isNaN(id_produit) || quantite <= 0) {
        const err:[string, boolean][] = [
          [ligne, false],
          [pg, isNaN(nums) || isNaN(proms)],
          [produit, isNaN(id_produit)],
          [quantite, quantite <= 0],
          [id_produit, isNaN(id_produit)]
        ]
        importErrors.push(err);
        return e;
      };
      return [lastKnown, id_produit, quantite]
    });

    importErrors = importErrors;
    if(importErrors.length != 0) return;

    fetch(`/boquette-${boquette.id_boquette}?/import_rhopse`, {
      method:'post',
      body:JSON.stringify(extractedData)
    })
    console.log(extractedData);
  }

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
        wsProducts.getCell(i,j+1).value = prod.prix;
        i += 1;
      }
    });
    const date = new Date();
    const nom = `${boquette.nom_simple}-produits-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}.xlsx`
    download(workbook, nom);
  }
</script>


<ToggleSectionCard title="Actions" toggleClass="h-48">
  <div class="flex flex-col gap-2 h-46 mt-5">
    <div class="flex flex-wrap justify-around gap-5 h-full text-white
    child:bg-blue-600 child:p-2 child:relative child:flex child:justify-center child:items-center child:w-2/5 child:rounded-md">  
      
    
    <button on:click={generateExcel}>      
        <p>Générer feuille de rhopse</p>
      </button>
      
      <label for="file_import">
        
        <input on:input={importExcel} bind:this={fileInputRhopse} class="hidden" id="file_import" accept=".xlsx" type="file">
        <button on:click={()=>fileInputRhopse.click()}>      
          <p>Importer feuille de rhopse</p>
        </button>
      </label>

      <!-- <button on:click={exporterProduits}>      
        <p>Exporter produits</p>
      </button> -->

      <button>
        <a href="/boquette-{boquette.id_boquette}/consommations">consommations</a>
      </button>

      <slot/>
    </div>
  </div>

{#if importErrors.length != 0}
<SectionCard title="Erreurs de Rhopse">
  <CustomTable elements={importErrors} headers={['Ligne','PG','Produit','Quantite','Id Produit']}>
    <svelte:fragment slot="tbody" let:e>
      <tr class="divide-x-2 divide-white ">
        {#each e as [content, isWrong]}
          <td class="{isWrong ?'bg-red-400':'bg-green-400'}">{content}</td>
        {/each}
      </tr>
    </svelte:fragment>
  </CustomTable>  
</SectionCard>
{/if}
</ToggleSectionCard>

