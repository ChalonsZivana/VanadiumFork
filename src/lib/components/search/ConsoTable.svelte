<script lang="ts">
  import MoneyColor from '../miscellaneous/MoneyColor.svelte';
  import AddRemoveConso from '../miscellaneous/AddRemoveConso.svelte';
  import type { ConsommationsIncludeType } from '$lib/server/classes/Taferie';

  export let fromOption:boolean;
  export let cancelOption:boolean;
  export let consommations:ConsommationsIncludeType[];

  function getFrom(e:ConsommationsIncludeType){
    if(e.type.startsWith('pg')){
      if(e.from_pg){
        return `${e.from_pg.nums}\nch\n${e.from_pg.proms}`;
       } else {
        return '∅'
       }
    }
    return 'EXT';
  }

  function getTo(e:ConsommationsIncludeType){
    switch(e.type){
      case 'ext_boq':
      case 'pg_boq':
        return e.to_boquette?.nom;
      case 'pg_ext':
        return 'EXT';
      case 'ext_fams':
      case 'pg_fams':
        return e.to_fams?.nums;
      case 'pg_pg':
        return 'PG';
    }
  }

  let headers = ['Date','De','Vers','Libellé','Montant'];
  if(cancelOption) headers.push('')

  function transformMontant(montant:number){
    const [hard, soft] = montant.toFixed(3).split('.').map(parseInt);

    return Math.sign(montant) * (hard + soft);
  }
</script>

<!-- Responsive Container (recommended) -->
<div class="table-container w-full flex-grow">
  <!-- Native Table Element -->
  <table class="table table-hover">
    <thead>
      <tr>
        <th class="text-xs">Date</th>
        {#if fromOption}
          <th class="text-xs">De</th>
        {/if}
        <th class="text-xs">Vers</th>
        <th class="text-xs">Libelle</th>
        <th class="text-xs">Montant</th>
        {#if cancelOption}
          <th></th>
        {/if}
      </tr>
    </thead>
    <tbody class="divide-y-2 divide-white">
      {#each consommations as conso}
          {@const date = conso.date_conso.toLocaleString().split(' ')}
          <tr class="{conso.annule?'line-through':''} decoration-2 divide-x-2">
            <td><span class="text-xxs">{date[0]}<br>{date[1]}</span></td>
            {#if fromOption}
              <td><span class="text-xxs whitespace-pre-wrap">{getFrom(conso)}</span></td>
            {/if}
            <td><div class="w-6 text-wrap text-xxs">{getTo(conso)}</div></td>
            <td>
              <div class="w-16 text-wrap text-xxs">{conso.libelle}</div>
            </td>
            <td><!-- Montant -->
              <p class=" text-xxs">AP. {conso.solde_apres.toFixed(2)}€</p>
  
              <!-- Foys -->
              {#if conso.type=='pg_boq' && conso.to==7} 
                <MoneyColor auto={transformMontant(conso.montant)} className="text-xs font-bold text-xxs"/>
              {:else}
                <MoneyColor auto={conso.montant} className="text-xs font-bold text-xxs"/>
              {/if}
              
              <p class=" text-xxs">AV. {conso.solde_avant.toFixed(2)}€</p>
            </td>
            {#if cancelOption}
            <td class="flex justify-center items-center">
              {#key conso.id_conso}
                <AddRemoveConso bind:id={conso.id_conso} bind:annule={conso.annule}/>
              {/key}
            </td>
          {/if}
          </tr>
        {/each}
    </tbody>
  </table>
</div>