<script lang="ts">
  import ExcelJS from 'exceljs';
  import SubmitDialog from '../miscellaneous/SubmitDialog.svelte';
  import CustomTable from '../miscellaneous/CustomTable.svelte';
  import ToggleSectionCard from '../ToggleSectionCard.svelte';
  import type { pg } from '@prisma/client';
  import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';
    import { number, string } from 'zod';

  export let id_boquette:number;
  export let pgs:Partial<pg>[];
  
  let dialog:HTMLDialogElement;

  let errors:{fileError:string|null, rhopsesError:[string|number|Partial<pg>, boolean][][]} = {
    fileError:null,
    rhopsesError:[]
  };
  let fileInputRhopse:HTMLInputElement;
  let rhopses: { [key: string]: number[] } = {};

  onMount(()=>{
    dialog.addEventListener("close",()=>{
      errors = {fileError:null, rhopsesError:[]};
      rhopses = {};
    })
  })

  const importExcel = async () => {
    const file = fileInputRhopse.files?.item(0);
    if(file == null) return errors.fileError = "Impossible d'importer le fichier";

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const wsProms = workbook.getWorksheet(`Rhopses`);
    const wsProds = workbook.getWorksheet('Produits')
    if(wsProms == null || wsProds == null) return errors.fileError = "La feuille 'Rhopses' ou 'Produits' est introuvable";

    let extractedData = (wsProms.getSheetValues() as any[]).map((e,i) => ({index:i, PG:e[1]??'', produit:e[2]??'', quantite:parseInt(e[3])||1,commentaire:e[5]??'', id_produit:parseInt(e[6].result)})) as {index:number, PG:string, produit:string, quantite:number, commentaire:number, id_produit:number}[];
    
    extractedData = extractedData.filter(e => e.PG != ''  || e.produit != '');
    extractedData.shift();

    if(extractedData.length == 0) return errors.fileError = "Le fichier ne contient pas de rhopses";
    let lastKnown:string = extractedData[0].PG;
    extractedData.forEach(e => {
      if(e.PG != '' && e.PG != undefined) lastKnown = e.PG.toLowerCase();
      const [nums, proms] = lastKnown.split('ch').map(e => parseInt(e));

      let rhopsePourUnAncien = null;
      let pg = pgs.find(e => e.nums == nums && e.proms == proms);
      if(pg == undefined){
        pg = pgs.filter(e => e.nums == nums)[0];
        rhopsePourUnAncien = e.PG;
      }

      if(isNaN(e.id_produit) || e.quantite <= 0 || pg == null) {
        const err:[string|number|Partial<pg>, boolean][] = [
          [e.index, false],
          [pg, isNaN(nums) || isNaN(proms)],
          [e.produit, isNaN(e.id_produit)],
          [e.quantite, e.quantite <= 0],
          [e.id_produit, isNaN(e.id_produit)]
        ]
        errors.rhopsesError.push(err);
        return e;
      };
      const aggregateKey = `${pg.id_pg}-${e.id_produit}`;
      if(aggregateKey in rhopses){
        rhopses[aggregateKey][2] += e.quantite;
      } else {
        rhopses[aggregateKey] = [pg.id_pg, e.id_produit, e.quantite, e.PG, produit, rhopsePourUnAncien]
      }
    });

    errors = errors;
    fileInputRhopse.value = '';
  }

  
</script>


<label for="file_import">
  <input on:change={()=>importExcel().then(()=>dialog.showModal())} bind:this={fileInputRhopse} class="hidden" id="file_import" accept=".xlsx" type="file">
  <button type="button" on:click={()=>fileInputRhopse.click()}>      
    <Icon icon="mdi:import"/>
  </button>
</label>



<SubmitDialog bind:dialog={dialog} formAction={`/boquette-${id_boquette}?/import_rhopse`} customEnhance={({formData, cancel})=>{
    if(errors.rhopsesError.length > 0) return cancel();
    
    formData.set('produits', JSON.stringify(Object.values(rhopses).map(e => [e[0],e[1],e[2], e[5]])));
  }} title="Importer Rhopses"> 
    <div class="mt-5"></div>
    <div class="flex flex-col gap-5">
      {#if errors.fileError != null}
        <p class="text-center text-white">{errors.fileError}</p>
      {:else if errors.rhopsesError.length > 0}
        <ToggleSectionCard title="Erreurs" show={true} toggleClass="h-96">
          <div class="w-full h-full overflow-x-hidden no-scrollbar overflow-y-scroll">
            <CustomTable elements={errors.rhopsesError} headers={['Ligne','PG','Produit','Quantite','Id Produit']}>
              <svelte:fragment slot="tbody" let:e>
                <tr class="divide-x-2 divide-white ">
                  {#each e as [content, isWrong]}
                    <td class="{isWrong ?'bg-red-400':'bg-green-400'}">{content}</td>
                  {/each}
                </tr>
              </svelte:fragment>
            </CustomTable>  
            </div>
        </ToggleSectionCard>
      {/if}

      {#if Object.keys(rhopses).length > 0}
        <ToggleSectionCard title="Rhopses" toggleClass="h-96">
          <div class="w-full h-full overflow-x-hidden no-scrollbar overflow-y-scroll">
            <CustomTable elements={Object.values(rhopses)} headers={['PG','Produit', 'Quantité']}>
              <svelte:fragment slot="tbody" let:e>
                <tr class="divide-x-2 divide-white ">
                  <td>{e[3]}</td>
                  <td>{e[4]}</td>
                  <td>{e[2]}</td>
                </tr>
              </svelte:fragment>
            </CustomTable>
            </div>
        </ToggleSectionCard>
      {/if}
    </div>
    
    <svelte:fragment slot="submitButton">
      {#if errors.rhopsesError.length > 0 || errors.fileError != null}
      <div></div>
      {:else}
      <button class="size-20 bg-blue-500 rounded-md">Rhopse</button>
      {/if}

    </svelte:fragment>
  </SubmitDialog>
