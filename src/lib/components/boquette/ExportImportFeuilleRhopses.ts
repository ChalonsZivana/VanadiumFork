import type { boquettes, categories,pg,produits } from "@prisma/client";
import ExcelJS from 'exceljs';


export async function download(workbook:ExcelJS.Workbook, nom:string){
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

async function generateExcel(products:produits[]) {
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


async function exporterProduits(boquette:boquettes,products:produits[], categories:categories[]){
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


const importExcel = async (file:File, pgs:Partial<pg>[]) => {
  let errors:{fileError:string|null, rhopsesError:[string, boolean][][]} = {
    fileError:null,
    rhopsesError:[]
  };
  let rhopses: { [key: string]: number[] } = {};

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  const wsProms = workbook.getWorksheet(`Rhopses`);
  const wsProds = workbook.getWorksheet('Produits')
  if(wsProms == null || wsProds == null) return errors.fileError = "La feuille 'Rhopses' ou 'Produits' est introuvable";

  let extractedData = (wsProms.getSheetValues() as any[]).map((e,i) => [i, e[1]??'', e[2]??'', e[3]??'', e[6].result]);
  extractedData = extractedData.filter(e => e[1] != ''  || e[2] != '');
  extractedData.shift();

  if(extractedData.length == 0) return errors.fileError = "Le fichier ne contient pas de rhopses";
  let lastKnown:string = extractedData[0][1];
  extractedData.forEach(e => {
    const [ligne, numsChproms, produit, _, __] = e;
    if(numsChproms != '' && numsChproms != undefined) lastKnown = numsChproms.toLowerCase();
    const [nums, proms] = lastKnown.split('ch').map(e => parseInt(e));
    let [quantite, id_produit] = [parseInt(e[3]), parseInt(e[4])];

    quantite = isNaN(quantite) ? 1 : quantite
    const pg = pgs.find(e => e.nums == nums && e.proms == proms);

    if(isNaN(id_produit) || quantite <= 0 || pg == null) {
      const err:[string, boolean][] = [
        [ligne, false],
        [pg, isNaN(nums) || isNaN(proms)],
        [produit, isNaN(id_produit)],
        [quantite, quantite <= 0],
        [id_produit, isNaN(id_produit)]
      ]
      errors.rhopsesError.push(err);
      return e;
    };
    const aggregateKey = `${pg.id_pg}-${id_produit}`;
    if(aggregateKey in rhopses){
      rhopses[aggregateKey][2] += quantite;
    } else {
      rhopses[aggregateKey] = [pg.id_pg, id_produit, quantite, numsChproms, produit]
    }
  });

  errors = errors;
  return {
    rhopses,
    errors,
  }
}