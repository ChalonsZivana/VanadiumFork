<script lang="ts">
  import BurgerMenu from "$lib/components/svgs/burger-menu.svelte";
  import EuroCoin from "$lib/components/svgs/euro-coin.svelte";
  import Note from "$lib/components/svgs/note.svelte";
  import Profile from "$lib/components/svgs/profile.svelte";
  import Stats from "$lib/components/svgs/stats.svelte";
  import LogalSoce from "$lib/components/svgs/logal-soce.svelte";
  import House from "$lib/components/svgs/house.svelte";
  import IconMousse from "$lib/components/svgs/boquettes/icon-mousse.svelte";
  import ConsoTable from "$lib/components/search/ConsoTable.svelte";
  import Consommations from "$lib/components/svgs/consommations.svelte";
  import IconStrassChoco from "$lib/components/svgs/boquettes/icon_strasschoco.svelte";
  import IconAuberge from "$lib/components/svgs/boquettes/icon_auberge.svelte";
  import IconCocks from "$lib/components/svgs/boquettes/icon_cocks.svelte";
  import IconFoys from "$lib/components/svgs/boquettes/icon_foys.svelte";
  import IconGutembs from "$lib/components/svgs/boquettes/icon_gutembs.svelte";
  import IconCopalerie from "$lib/components/svgs/boquettes/icon_copalerie.svelte";
  import IconZMD from "$lib/components/svgs/boquettes/icon_zmd.svelte";
  import IconKoenettrie from "$lib/components/svgs/boquettes/icon_koennetrie.svelte";
  import IconMamserie from "$lib/components/svgs/boquettes/icon_mamserie.svelte";
  import IconRitalerie from "$lib/components/svgs/boquettes/icon_ritalerie.svelte";
  import IconBreizhouzerie from "$lib/components/svgs/boquettes/icon_breizhouzerie.svelte";
  import Top from "$lib/components/miscellaneous/Leaderboard.svelte";
  import SquareRightArrow from "$lib/components/svgs/square-right-arrow.svelte";

  export let data;

  const sections =  [
    {id:1, component:Note, href:'/rhopses'},
    {id:2, component:Stats, href:'/stats'},
    {id:3, component:LogalSoce, href:'/test'},
    {id:4, component:Profile, href:'/profile'},
    {id:5, component:EuroCoin, href:'/rechargement'},
  ];
  let isBoquettesMenu = false;
  let selected = 3;
  const select = (id:number) =>  {
    selected = id;
  }

  type BoquetteIconMap = {
  [key: number]: typeof IconStrassChoco | typeof IconMousse;
};

  const boquettesIcons:BoquetteIconMap = {
    1:IconStrassChoco,
    2:IconMousse,
    3:IconAuberge,
    4:IconCocks,
    7:IconFoys,
    8:IconGutembs,
    17:IconCopalerie,
    20:EuroCoin,
    143:IconZMD,
    147:IconKoenettrie,
    193:IconMamserie,
    195:IconRitalerie,
    197:IconBreizhouzerie
  }

  let section  = 0;

  const negats = Object.entries(data.negats);

  const num = 89;
</script>

<div class="h-screen overflow-hidden bg-black">
  <div class="absolute w-full top-0 left-0 h-32">
    <div class="absolute flex w-full justify-end p-2 top-2 z-10">
      <div class="rounded-full flex {isBoquettesMenu?'bg-[#262626]':''}">
        
        <div class="flex flex-col duration-300 {isBoquettesMenu ? 'h-full scale-x-100':'h-0 scale-x-0'}">
          {#each data.BOQUETTES as boquette}
          <a href="/boquette-{boquette.id_boquette}" class="size-16 p-3 duration-300">
            <svelte:component this={boquettesIcons[boquette.id_boquette]}/>

          </a>
          {/each}

        </div>
        <button on:click={()=>isBoquettesMenu = !isBoquettesMenu} class="size-16  rounded-full">
          <House/>
        </button>
      </div>
      
    </div>
  </div>
  <div class="h-16">
  </div>
<div class="h-full w-full flex flex-col gap-10  p-8 duration-500 {section != 0 ? '-translate-y-full':'translate-y-000' }">
  
  <p class="text-white text-2xl font-bold text-start">Bienvenue sur Vanadium</p>

      <div class="aspect-video w-full relative bg-gradient-to-t text-white p-2 from-red-600 to-red-500 self-center rounded-3xl">
    <p class="absolute font-zagoth opacity-50 bottom-auto right-2 text-9xl">{num}</p>

    <div class="p-4">
      <p>Prénom: {data.USER.pg.prenom}</p>
      <p>Nom: {data.USER.pg.nom}</p>
      <p>Bucque: {data.USER.pg.bucque}</p>
    
      <!-- <Special special={[11,89,111].includes(data.USER.pg.nums??-1)}>
        <p>Nums: {data.USER.pg.nums}</p>
      </Special> -->
      <p>Proms: {data.USER.pg.proms}</p>
      <p>Email: {data.USER.pg.email}</p>
    </div>
  </div>

  <div class="w-full border-t-1 border-white"></div>

  <div class="flex flex-col w-full gap-5 text-white self-center">
    <!-- Fonds -->
    
    <div class="bg-[#262626] w-full h-20 rounded-3xl p-4 gap-4 flex justify-start items-center">
      <div class="size-10">
        <EuroCoin/>
      </div>
      <div class="grid grid-cols-2 w-full h-full divide-x-1 divide-white">
        <div class="flex flex-col content-center items-start">
          <p class="font-bold">Fonds</p>
          <p>{data.USER.pg.solde}€</p>
        </div>
        <div class="flex flex-col justify-center items-center">
          <p class="font-bold">Fonds Fams</p>
          <p>{data.USER.fams.solde}€</p>
        </div>
      </div>
    </div>
  
    <!-- Negat's -->
  
    <div class="bg-[#262626] w-full rounded-3xl p-4 gap-4 flex justify-start items-center">
      <div class="size-10">
        <EuroCoin/>
      </div>
      <div class="flex flex-col h-full w-full ">
        <p class="font-bold">Negat's</p>
        <div class="grid grid-cols-2 w-full divide-x-1 divide-white">
          <div>
            <p class="font-bold">{negats[0][0]}</p>
            <p>{negats[0][1]}€</p>
          </div>
          <div class="flex flex-col justify-center items-center">
            <p class="font-bold">{negats[1][0]}</p>
            <p>{negats[1][1]}€</p>
          </div>
        </div>
      </div>
      
    </div>
   
    
    <div class="flex gap-2 w-full flex-wrap">
      <button on:click={()=>section=2} class="bg-[#262626] active:bg-gray-500 flex-1 h-20 rounded-3xl p-4 gap-4 flex justify-start items-center">
        <div class="size-8">
          <Stats/>
        </div>
        <div class="flex flex-col">
          <p class="font-bold text-sm">Stats</p>
        </div>
      </button>
      <button on:click={()=>section = 1} class="bg-[#262626] active:bg-gray-500 flex-1 h-20 rounded-3xl p-4 gap-4 flex justify-start items-center">
        <div class="size-8">
          <Consommations/>
        </div>
        <div class="flex flex-col">
          <p class="font-bold text-sm">Consommations</p>
        </div>
      </button>
    </div>

    
  </div>




  
</div>

<!-- consommations -->
<div class="h-full w-full flex flex-col gap-10  p-8 duration-500 {section == 1 ? '-translate-y-full':'translate-y-000' }">
  <div>
    <button on:click={()=>section = 0} class="text-white w-full bg-[#262626] active:bg-gray-500 flex-1 h-20 rounded-3xl p-4 gap-4 flex justify-start items-center">
      <div class="size-8">
        <Consommations/>
      </div>
      <div class="flex flex-col">
        <p class="font-bold text-sm">Consommations</p>
      </div>
    </button>
  </div>
  {#await data.consommations}
    Chargement top global...
  {:then consommations} 
    <div class="w-full rounded-3xl h-3/5 overflow-x-hidden no-scrollbar overflow-y-scroll">
      <ConsoTable consommations={consommations} cancelOption={false}/>
    </div>
  {/await}
</div>

<!-- top -->
<div class="h-full w-full flex flex-col gap-10  p-8 duration-500 {section == 2 ? '-translate-y-[200%]':'translate-y-000' }">
  <div>
    <button on:click={()=>section = 0} class="text-white w-full bg-[#262626] active:bg-gray-500 flex-1 h-20 rounded-3xl p-4 gap-4 flex justify-start items-center">
      <div class="size-8">
        <Stats/>
      </div>
      <div class="flex flex-col">
        <p class="font-bold text-sm">Statistiques</p>
      </div>
    </button>
  </div>
  <div class="flex flex-col text-white items-center gap-5 w-full mb-5 md:flex-row overflow-scroll">
      {#await data.topGlobal}
        Chargement top global...
      {:then top} 
        <div class="flex flex-col rounded-3xl bg-[#262626] w-full pt-6 pb-10 gap-6">
          <p class="text-center font-bold">{top.name}</p>
          <Top top={top}/>
        </div>
      {/await}
    {#await data.topDuJour}
      Chargement top global...
    {:then top} 
    <div class="relative flex flex-col rounded-3xl bg-[#262626] w-full pt-6 pb-10 gap-6">
      <p class="text-center font-bold">{top.name}</p>
        <Top top={top}/>
        <a href="/stats">
          <SquareRightArrow className="w-10 absolute top-2 right-2"/>
        </a>
        </div>
    {/await}
  </div>
  <div class="h-20"></div>
</div>

<div class="absolute left-0 z-50 w-full bg-black bottom-0 pl-0 pr-0">
  <div class="grid grid-cols-5 place-items-center h-20">
    {#each sections as item}
      <a href={item.href}>
        <button on:click={()=>select(item.id)} class="p-2 {selected==item.id ? 'size-20 -translate-y-8  origin-bottom duration-300 bg-red-600 rounded-full':'size-16'}">
          <svelte:component this={item.component}/>
        </button>
      </a>
    {/each}
  </div>
</div>
</div>