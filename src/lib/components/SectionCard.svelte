<script lang="ts"> 
  export let title:string;
</script>

<div class="bg-red-900 w-full h-fit bg-opacity-100 p-2 rounded-md relative">
  <div class="flex flex-col items-center gap-5">
    <p class="font-zagoth text-3xl text-white">{title}</p>
    <slot/>
  </div>
</div>