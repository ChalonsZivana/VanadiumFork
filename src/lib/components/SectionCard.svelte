<script lang="ts">
    import Special from "./miscellaneous/Special.svelte";

  export let title:string;
</script>


<div class="bg-red-900 w-full h-fit bg-opacity-100 p-2 rounded-md relative">
  <div class="flex flex-col items-center gap-5 text-white">
    <p class="font-zagoth text-3xl">
      <Special special={title=="Fams 11"}>
        {title}
      </Special>
    </p>
      <slot/>
  </div>
</div>

