<script lang="ts">
  import ExcelJS from 'exceljs';
  import type {produits} from '@prisma/client';
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte"
  import SectionCard from "$lib/components/SectionCard.svelte"

  export let pgs:{nums:number,proms:number, id_pg:number}[];
  export let products:produits[];
  
  let importErrors: [string, boolean][][] = [];
  
  let fileInput:HTMLInputElement;
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

    const buffer = await workbook.xlsx.writeBuffer();
    const date = new Date();
    
    // Télécharger le fichier Excel
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feuille_rhopses_${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

  async function importExcel(){
    console.log('import')
    const file = fileInput.files?.item(0);
    if(file == null) return;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const wsProms = workbook.getWorksheet(`Rhopses`);
    if(wsProms == null) return;
    let extractedData = (wsProms.getSheetValues() as any[]).map((e,i) => [i+1, e[1], e[2], e[3], e[6].result]);
    extractedData = extractedData.filter(e => e[1] != '' || e[2] != '');
    extractedData.shift();
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

    fetch("?/import_rhopse", {
      method:'post',
      body:JSON.stringify(extractedData)
    })
    console.log(extractedData);
  }
</script>

{#await pgs}
  Chargement rhopses...
{:then _} 
  <div class="flex flex-col gap-2 h-20">
    <div class="flex justify-around gap-5 h-full">  
      <button class="bg-blue-600 relative flex justify-center items-center text-white w-2/5 rounded-md" on:click={generateExcel}>      
        <p>Générer feuille de rhopse</p>
      </button>
      
      <label for="file_import" class="w-2/5 h-full">
        <input on:input={importExcel} bind:this={fileInput} class="hidden" id="file_import" accept=".xlsx" type="file">
        <button on:click={()=>fileInput.click()} class="bg-blue-600 h-full relative flex justify-center items-center text-white w-full rounded-md">      
          <p>Importer feuille de rhopse</p>
        </button>
      </label>
    </div>
  </div>
{/await}

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

