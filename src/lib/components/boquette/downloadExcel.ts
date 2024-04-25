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