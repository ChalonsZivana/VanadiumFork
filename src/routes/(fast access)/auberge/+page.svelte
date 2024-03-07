<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  export let data;

  let toggle = 0;
</script>

<div class="flex flex-col h-full">
  <div class="h-28 flex flex-col justify-center items-center">
    <p class="font-zagoth text-4xl text-white">Grosseure et bourrelet</p>
  </div>
  <div class="w-full h-full flex flex-col text-white justify-center items-center gap-5">
    <button class="w-11/12" on:click={()=>toggle = 0}>
      <SectionCard title="Les dernières commandes">
        {#if data.auberge[0].length}
        <div class="{(toggle==0)?'h-96':'h-0'} overflow-y-scroll duration-300">
            <table class="w-full">
              <thead>
                <tr class="text-left">
                  <th>Id</th>
                  <th>Pg</th>
                  <th>Details</th>
                  <th>Telephone</th>
                </tr>
              </thead>
              <tbody>
                {#each data.auberge[0] as commande}
                  <tr class="border-solid border-t-2">
                    <th>{commande.id}</th>
                    <td>{commande.pg.nums}ch{commande.pg.proms}</td>
                    <td class="p-1 text-wrap">{commande.type} - {commande.bandars} - {commande.fromage} - {commande.commentaire}</td>
                    <td>{commande.telephone}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
        </div>
        {:else}
          Pas de commandes
        {/if}
      </SectionCard>
    </button>
    <button class="w-11/12"  on:click={()=>toggle = 1}>
      <SectionCard title="Commandes en cours de préparations">
        {#if data.auberge[1].length}
        <div class="{(toggle==2)?'h-96':'h-0'} overflow-y-scroll duration-300">
            <table class="w-full">
              <thead>
                <tr class="text-left">
                  <th>Id</th>
                  <th>Pg</th>
                  <th>Details</th>
                  <th>Telephone</th>
                </tr>
              </thead>
              <tbody>
                {#each data.auberge[1] as commande}
                  <tr class="border-solid border-t-2">
                    <th>{commande.id}</th>
                    <td>{commande.pg.nums}ch{commande.pg.proms}</td>
                    <td class="p-1 text-wrap">{commande.type} - {commande.bandars} - {commande.fromage} - {commande.commentaire}</td>
                    <td>{commande.telephone}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
        </div>
        {:else}
          Pas de commandes
        {/if}
      </SectionCard>
    </button>
    <button class="w-11/12" on:click={()=>toggle = 2}>
      <SectionCard title="Commandes finish">
        <div class="{(toggle==2)?'h-96':'h-0'} overflow-y-scroll duration-300">
        <table class="w-full">
          <thead>
            <tr class="text-left">
              <th>Id</th>
              <th>Pg</th>
              <th>Details</th>
              <th>Telephone</th>
            </tr>
          </thead>
          <tbody>
            {#each data.auberge[2] as commande}
              <tr class="border-solid border-t-2">
                <th>{commande.id}</th>
                <td>{commande.pg.nums}ch{commande.pg.proms}</td>
                <td class="p-1 text-wrap">{commande.type} - {commande.bandars} - {commande.fromage} - {commande.commentaire}</td>
                <td>{commande.telephone}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      </SectionCard>
    </button>
  </div>
</div>
