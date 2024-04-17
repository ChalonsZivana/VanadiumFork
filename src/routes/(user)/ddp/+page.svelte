<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import CustomTable from "$lib/components/miscellaneous/CustomTable.svelte";
  import Special from "$lib/components/miscellaneous/Special.svelte"
  import MoneyColor from "$lib/components/miscellaneous/MoneyColor.svelte"

  export let data;
</script>

<div class="w-11/12 mt-5 mb-5 h-96">
  <SectionCard title="Proms {data.proms}">
    <CustomTable elements={data.pgs} headers={['PG','Bucque','Email','Solde']}>
      <tr slot="tbody" let:e>
        <th class="p-2">
          <Special special={[11,89,111].includes(e.nums??-1)}>
            {e.nums}Ch{e.proms}
          </Special>
        </th>
        <td>{e.bucque}</td>
        <td>{e.email}</td>
        <td>
          <MoneyColor auto={e.solde} className="text-xs font-bold"/>
        </td>
      <tr/>
    </CustomTable>
  </SectionCard>
</div>