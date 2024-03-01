<script lang="ts"> 
  export let title:string;
</script>

<div class="bg-red-950 w-full h-fit bg-opacity-90 p-2 rounded-md">
  <div class="flex flex-col items-center gap-5 text-white">
    <p class="font-zagoth text-3xl">{title}</p>
    <slot/>
  </div>
</div>