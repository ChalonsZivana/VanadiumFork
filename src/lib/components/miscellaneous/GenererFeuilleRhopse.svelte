<script lang="ts">
  import ExcelJS from 'exceljs';
  import type {produits} from '@prisma/client';
    import MyButton from '../utils/MyButton.svelte';

  export let products:produits[];
  
  let files:FileList;

  const  t= ()=>{
    const b = new FileReader();

  }

  $: if (files) {
    // Note that `files` is of type `FileList`, not an Array:
    // https://developer.mozilla.org/en-US/docs/Web/API/FileList
    console.log(files);

    for (const file of files) {
      console.log(`${file.name}: ${file.size} bytes`);
    }
  }

  async function generateExcel() { 
    const workbook = new ExcelJS.Workbook();  
    const rhopseModel  = await(await fetch(`/FeuilleDeRhopseModel.xlsx`)).arrayBuffer();
    await workbook.xlsx.load(rhopseModel);


    const wsProducts = workbook.getWorksheet('Produits')
    if(wsProducts == undefined) return;
    wsProducts.getCell(1, 1).value = 'Produits';
    wsProducts.getCell(1, 2).value = 'Prix';
    for(let [i,prod] of products.entries()){
      wsProducts.getCell(2 + i, 1).value = prod.nom;
      wsProducts.getCell(2 + i, 2).value = prod.prix;
    }


    


 


    const wsProms = workbook.getWorksheet(`Rhopses`);
    if(wsProms == undefined) return;

    //@ts-ignore
    wsProms.dataValidations.model['B2:B9999'] = {
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
</script>

<div class="flex gap-5">
  <MyButton value="Générer feuille de rhopse" callback={generateExcel}/>
  
  
  <label for="file_import">
    <input class="hidden" id="file_import" accept=".xlsx" type="file" bind:files={files}>
    <div class="pointer-events-none">
      <MyButton value="Importer feuille de rhopse"/>
    </div>
  </label>
</div>

