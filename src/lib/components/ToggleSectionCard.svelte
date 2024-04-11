<script lang="ts">
  import DoubleDownChevron from "./svgs/double-down-chevron.svelte";


  export let title:string;
  export let toggleClass = "";
  let show = false;

  function toggle(e:MouseEvent){
    show = !show;
  }
</script>

<div class="bg-red-900 w-full bg-opacity-100 p-2 rounded-md relative">
  <div class="flex flex-col items-center text-white">

    <button type="button" class="w-full flex justify-between" on:click={toggle}>
      <DoubleDownChevron className="w-8 opacity-50 {show ? "":'rotate-180'}"/>
      <p class="font-zagoth text-3xl">{title}</p>
      <DoubleDownChevron className="w-8 opacity-50 {show ? "":'rotate-180'}"/>
    </button>

    
    <div class="{show ? `${toggleClass} scale-y-100`:'h-0 scale-y-0'} duration-300 origin-top w-full">
      <slot/>
    </div>
  </div>
</div>