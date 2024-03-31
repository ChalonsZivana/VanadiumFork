<script lang="ts">
  import DoubleDownChevron from "./svgs/double-down-chevron.svelte";


  export let title:string;
  export let toggleClass = "";
  let show = false;
</script>

<button class="bg-red-900 w-full bg-opacity-100 p-2 rounded-md relative" on:click={()=>show = !show}>
  <div class="flex flex-col items-center text-white">
    <p class="font-zagoth text-3xl">{title}</p>

    <div class="w-full absolute bottom-0 flex justify-between">
      <DoubleDownChevron className="w-8 opacity-50 {show ? "rotate-180":''}"/>
      <DoubleDownChevron className="w-8 opacity-50 {show ? "rotate-180":''}"/>
    </div>
    <div class="{show ? `${toggleClass} scale-y-100`:'h-0 scale-y-0'} duration-300 origin-top">
      <slot/>
    </div>
  </div>
</button>