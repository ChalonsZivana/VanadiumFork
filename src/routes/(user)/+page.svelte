
<script lang="ts">
  import Profile from "$lib/components/profiles/UserProfile.svelte";
  import Negats from "$lib/components/profiles/Negats.svelte";
  import SquareRightArrow from "$lib/components/svgs/square-right-arrow.svelte";
  import Top from "$lib/components/miscellaneous/Top.svelte";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import ConsoTable from "$lib/components/search/ConsoTable.svelte";
  export let data;

  let scrollContainer:HTMLElement;
  let section1:HTMLElement;
  let section2:HTMLElement;

  let lastTouchY = 0;
  const ontouchmove = (e: TouchEvent) => {
    if(scrollContainer.scrollTop >= section1.clientHeight) {
      return;
    }
    const touchY = e.touches[0].clientY;    
    const deltaY = lastTouchY - touchY;
    lastTouchY = touchY;

    if (deltaY > 0) {
        scrollContainer.scrollTo({ top: section2.offsetTop, behavior: "smooth" });
    } else {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
    e.preventDefault()
  };
  const onwheel = (e:WheelEvent)=> { 
    if(scrollContainer.scrollTop >= section1.clientHeight) {
      return;
    }
    if(e.deltaY > 0){
      scrollContainer.scrollTo({ top:section1.clientHeight, behavior:"smooth"});
    } else {
      scrollContainer.scrollTo({ top:0, behavior:"smooth" });
    }  
    e.preventDefault()
  }
  let devicePixelRatio:number;
</script>

<svelte:window bind:devicePixelRatio={devicePixelRatio}/>

<div bind:this={scrollContainer} on:touchmove={ontouchmove}  on:wheel={onwheel} class="flex flex-col items-center w-full pt-2 overflow-y-scroll">
  <div class="flex flex-col items-center w-full gap-10">
    <section bind:this={section1} class="pb-2 w-11/12 flex flex-col gap-5">
      <Profile user={data.USER}/>
      <SectionCard title="">
        <img src={data.photo} alt={data.photo}>
      </SectionCard>
      <Negats negats={data.negats}/>
    </section> 
    <section bind:this={section2} class="w-11/12 flex flex-col justify-start gap-2">
      <SectionCard title="Consommations">
        {#await data.consommations}
          Chargement top global...
        {:then consommations} 
        <div style="height: 600px;" class="w-full overflow-x-hidden no-scrollbar overflow-y-scroll">
          <ConsoTable consommations={consommations} cancelOption={false}/>
          </div>
        {/await}
      </SectionCard>
    </section> 
    <section bind:this={section2} class="w-11/12 flex flex-col md:flex-row justify-start gap-2">
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
    </section> 
  </div>
</div>
