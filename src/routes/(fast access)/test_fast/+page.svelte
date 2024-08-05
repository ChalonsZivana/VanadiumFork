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
    import Special from "$lib/components/miscellaneous/Special.svelte";

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

    const num = 89;
</script>

<div class="h-full w-full flex flex-col gap-10 bg-black p-8">
  <div class="absolute w-full top-0 left-0 h-32">
    <div class="absolute flex w-full justify-between p-2 top-2 z-10">
      <div></div>
      <div class="p-3 size-16  rounded-full">
        <BurgerMenu className=""/>
      </div>
      <div class="rounded-full {isBoquettesMenu?'bg-[#262626]':''}">
        <button on:click={()=>isBoquettesMenu = !isBoquettesMenu} class="size-16  rounded-full">
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
      
    </div>
  </div>

  <div class="h-16">

  </div>

  <p class="text-white text-2xl font-bold text-start">Bienvenue sur Vanadium</p>

  <div class="aspect-video w-full relative bg-gradient-to-t text-white p-2 from-red-600 to-red-500 self-center rounded-3xl">
    <p class="absolute font-zagoth opacity-50 bottom-auto right-2 text-9xl">{num}</p>

    <div class="p-4">
        <p>Prénom: Louis-Matthieu</p>
        <p>Nom: Gerard</p>
        <p>Bucque: Le'Me</p>
<!--       
        <Special special={[11,89,111].includes(89??-1)}>
          <p>Nums: 89</p>
        </Special> -->
        <p>Proms: 223</p>
        <p>Email: lmgd@outlook.com</p>
    </div>
</div>

<div class="w-full border-t-1 border-white">

</div>

  <div class="flex flex-col w-full gap-5 text-white self-center">
    <!-- Fonds -->
    
    <div class="bg-[#262626] w-full h-20 rounded-3xl p-4 gap-4 flex justify-start items-center">
      <div class="size-10">
        <EuroCoin/>
      </div>
      <div class="grid grid-cols-2 w-full h-full">
        <div class="flex flex-col content-center items-start border-r-1 border-white">
          <p class="font-bold">Fonds</p>
          <p>89€</p>
        </div>
        <div class="flex flex-col justify-center items-center">
          <p class="font-bold">Fonds Fams</p>
          <p>89€</p>
        </div>
      </div>
    </div>

    <!-- Negat's -->

    <div class="bg-[#262626] w-full rounded-3xl p-4 gap-4 flex justify-start items-center">
      <div class="size-10">
        <EuroCoin/>
      </div>
      <div class="flex flex-col h-full w-full">
        <p class="font-bold">Negat's</p>
        <div class="grid grid-cols-2 w-full">
          <div class="flex flex-col items-start border-r-1 border-white">
            <p class="font-bold">222</p>
            <p>89€</p>
          </div>
          <div class="flex flex-col justify-center items-center">
            <p class="font-bold">223</p>
            <p>89€</p>
          </div>
        </div>
      </div>
      
    </div>
   
    
    <div class="flex gap-2 w-full flex-wrap">
      <a href="/stats" class="bg-[#262626] active:bg-gray-500 flex-1 h-20 rounded-3xl p-4 gap-4 flex justify-start items-center">
        <div class="size-8">
          <Stats/>
        </div>
        <div class="flex flex-col">
          <p class="font-bold text-sm">Stats</p>
        </div>
      </a>
      <div class="bg-[#262626] active:bg-gray-500 flex-1 h-20 rounded-3xl p-4 gap-4 flex justify-start items-center">
        <div class="size-8">
          <Profile/>
        </div>
        <div class="flex flex-col">
          <p class="font-bold text-sm">Consommations</p>
        </div>
      </div>
    </div>
  </div>
</div>