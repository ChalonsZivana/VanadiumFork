<script lang="ts">
    import BurgerMenu from "$lib/components/svgs/burger-menu.svelte";
    import EuroCoin from "$lib/components/svgs/euro-coin.svelte";
    import Note from "$lib/components/svgs/note.svelte";
    import Profile from "$lib/components/svgs/profile.svelte";
    import Stats from "$lib/components/svgs/stats.svelte";
    import LogalSoce from "$lib/components/svgs/logal-soce.svelte";
    import House from "$lib/components/svgs/house.svelte";
    import IconMousse from "$lib/components/svgs/boquettes/icon-mousse.svelte";
    import SectionCard from "$lib/components/SectionCard.svelte";

    export let data;

    const sections =  [
      {id:1, component:Note},
      {id:2, component:Stats},
      {id:3, component:LogalSoce},
      {id:4, component:Profile},
      {id:5, component:EuroCoin},
    ];
    let isBoquettesMenu = false;
    let selected = 3;
    const select = (id:number) =>  {
      selected = id;
    }

    const fonds = [
      {nom:"Fonds", solde:33.2},
      {nom:"Fonds Fam's", solde:-16},
    ];
    const negats = [
      {nom:"Negats 222", solde:33.2},
      {nom:"Negats 223", solde:-16},
    ];
    const boquettes = [
      {id_boquette:2}
    ]
</script>

<div class="h-full w-full flex flex-col gap-10 items-center bg-gradient-to-t from-red-900 to-black">
  <div class="absolute w-full top-0 left-0 h-32">
    <div class="absolute flex w-full justify-between p-2 top-2">
      <div class="p-3 size-20 bg-black rounded-full">
        <BurgerMenu className=""/>
      </div>
      <div class="rounded-full {isBoquettesMenu?'bg-black':''}">
        <button on:click={()=>isBoquettesMenu = !isBoquettesMenu} class="size-20 bg-black rounded-full">
          <House/>
        </button>
        <div class="flex flex-col duration-300 {isBoquettesMenu ? 'h-full scale-y-100':'h-0 scale-y-0'}">
          <button class="size-20 p-3 duration-300">
            <IconMousse/>
          </button>
          <button class="size-20 p-3 duration-300">
            <IconMousse/>
          </button>
          <button class="size-20 p-3 duration-300">
            <IconMousse/>
          </button>
        </div>
      </div>

      <SectionCard title="test">
        {#each data.pgs as pg}
          <p>{pg.nom} {pg.nums}ch{pg.proms}</p>
        {/each}
      </SectionCard>
      
    </div>
    <!-- <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="#7E0200" fill-opacity="1" d="M0,256L60,250.7C120,245,240,235,360,208C480,181,600,139,720,106.7C840,75,960,53,1080,85.3C1200,117,1320,203,1380,245.3L1440,288L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg> -->
  </div>

  <p class="font-zagoth text-[8em] text-white text-shadow-lg shadow-white">
    40
  </p>

  <div class="flex text-xl w-full justify-around">
    {#each fonds as fond}
      <div class="shadow-[0_0_2px,inset_0_0_2px,0_0_5px,0_0_15px,0_0_30px] flex flex-col justify-center items-center w-1/3 p-3 bg-black text-white rounded-md border-2 border-white {fond.solde > 0 ? 'shadow-green-500':'shadow-red-500'}">
        <p>{fond.nom}</p>
        <p class="font-bold">{fond.solde}€</p>
      </div>
    {/each}
  </div>


  
  <div class="w-11/12 relative">
    <img class="relative w-full h-auto z-10" src="\photos\animaux\[pixabay.com][131]horse-561221__480.jpg" alt="vanadium" srcset="">
    <div class="absolute top-2 left-2 w-full h-full bg-black"></div>
  </div>

  <div class="flex text-xl w-full justify-around">
    {#each negats as fond}
      <div class="shadow-[0_0_2px,inset_0_0_2px,0_0_5px,0_0_15px,0_0_30px] flex flex-col justify-center items-center w-1/3 p-3 bg-black text-white rounded-md border-2 border-white {fond.solde > 0 ? 'shadow-green-500':'shadow-red-500'}">
        <p>{fond.nom}</p>
        <p class="font-bold">{fond.solde}€</p>
      </div>
    {/each}
  </div>


  <div class="absolute z-50 w-full bg-black bottom-0 pl-4 pr-4">
    <div class="grid grid-cols-5 place-items-center h-24">
      {#each sections as item}
        <button on:click={()=>select(item.id)} class="p-2 {selected==item.id ? 'size-24 -translate-y-12  origin-bottom duration-300 bg-red-600 rounded-full':'size-16'}">
          <svelte:component this={item.component}/>
        </button>
      {/each}
    </div>
  </div>
</div>