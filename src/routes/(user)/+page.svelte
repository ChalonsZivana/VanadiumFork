
<script lang="ts">
  import Profile from "$lib/components/profiles/UserProfile.svelte";
  import Negats from "$lib/components/profiles/Negats.svelte";
  import SquareRightArrow from "$lib/components/svgs/square-right-arrow.svelte";
  import Top from "$lib/components/miscellaneous/Top.svelte";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import ConsoTable from "$lib/components/search/ConsoTable.svelte";
  import ToggleSectionCard from "$lib/components/ToggleSectionCard.svelte";
  export let data;
 
</script>


<div class="flex flex-col items-center w-11/12 gap-5 pt-5">
      <Profile user={data.USER}/>
      <SectionCard title="">
        <img src={data.photo} alt={data.photo}>
      </SectionCard>
      <Negats negats={data.negats}/>
      <ToggleSectionCard title="Consommations" toggleClass="h-[600px]">
        {#await data.consommations}
          Chargement top global...
        {:then consommations} 
        <div class="w-full h-full overflow-x-hidden no-scrollbar overflow-y-scroll">
          <ConsoTable consommations={consommations} cancelOption={false}/>
          </div>
        {/await}
      </ToggleSectionCard>

      <SectionCard title="Top Global">
        {#await data.topGlobal}
          Chargement top global...
        {:then top} 
          <Top top={top}/>
        {/await}
      </SectionCard>
      {#await data.topDuJour}
        Chargement top global...
      {:then top} 
        <SectionCard title={top.name}>
          <Top top={top}/>
          <a href="/stats">
            <SquareRightArrow className="w-10 absolute top-2 right-2"/>
          </a>
        </SectionCard>
      {/await}
</div>
