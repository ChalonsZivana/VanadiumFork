<script lang="ts">
  import CustomTable from '$lib/components/miscellaneous/CustomTable.svelte';
  import MoneyColor from '../miscellaneous/MoneyColor.svelte';
  import AddRemoveConso from '../miscellaneous/AddRemoveConso.svelte';
  import type { ConsommationsIncludeType } from '$lib/server/classes/Taferie';

  export let cancelOption:boolean;
  export let consommations:ConsommationsIncludeType[];

  function getFrom(e:ConsommationsIncludeType){
    if(e.type.startsWith('pg')){
      return `${e.from_pg?.nums}Ch${e.from_pg?.proms}`;
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
</script>

  <CustomTable elements={consommations} headers={headers}>
    <svelte:fragment slot="tbody" let:e>
      {@const [_from,_to] = e.type.toUpperCase().split('_')}
      {#key e}
        <tr class="{e.annule?'line-through':''} decoration-2 divide-x-2">
          <td><!-- Date -->
            <p>{e.date_conso.toLocaleDateString()}</p>
            <p>{e.date_conso.toLocaleTimeString()}</p>
          </td>
          <td>{getFrom(e)}</td><!-- From -->
          <td class="overflow-ellipsis">{getTo(e)}</td><!-- To -->
          <td>{e.libelle}</td><!-- Libellé -->
          <td><!-- Montant -->
            <p>AV. {e.solde_avant}€</p>
            <MoneyColor red={e.montant} className="text-sm font-bold"/>
            <p>AP. {e.solde_apres}€</p>
          </td>
          {#if cancelOption}
            <td>
              <AddRemoveConso id={e.id_conso} annule={e.annule}/>
            </td>
          {/if}
        </tr>
      {/key}
    </svelte:fragment>
  </CustomTable>
