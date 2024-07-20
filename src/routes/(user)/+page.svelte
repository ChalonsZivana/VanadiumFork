
<script lang="ts">
  import Profile from "$lib/components/pg/UserProfile.svelte";
  import Negats from "$lib/components/pg/Negats.svelte";
  import SquareRightArrow from "$lib/components/svgs/square-right-arrow.svelte";
  import Top from "$lib/components/miscellaneous/Leaderboard.svelte";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import ConsoTable from "$lib/components/search/ConsoTable.svelte";
  import ToggleSectionCard from "$lib/components/ToggleSectionCard.svelte";
  import { onMount } from "svelte";
  export let data;


  onMount(()=>{
  //   Notification.requestPermission().then((permission)=>{
  //   if(permission == 'granted'){
  //     new Notification("You are now subscribed to notifications !");
  //   }
  // })
  })

  const className = "flex flex-col items-center gap-5"
</script>


<div class="{className} w-11/12 pt-5">
      <div class="{className} w-full md:grid md:grid-cols-2 md:grid-rows-2 md:items-start">
        <Profile bind:user={data.USER}>
          
        </Profile>

        <div class="row-span-2 w-full">
          <SectionCard title="">
            <img src={data.photo} alt={data.photo}>
          </SectionCard>
        </div>
        <Negats negats={data.negats}/>
      </div>
      <div class="{className} w-full">
        <ToggleSectionCard title="Consommations" toggleClass="h-[600px]">
          {#await data.consommations}
            Chargement top global...
          {:then consommations} 
            <div class="w-full h-full overflow-x-hidden no-scrollbar overflow-y-scroll">
              <ConsoTable consommations={consommations} cancelOption={false}/>
            </div>
          {/await}
        </ToggleSectionCard>
  
        <div class="{className} w-full mb-5 md:flex-row">
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
      </div>
</div>
