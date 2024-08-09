<script lang="ts">
    import Special from "./miscellaneous/Special.svelte";

  export let title:string;
</script>


<div class="card relative p-4 variant-filled-surface bg-gradient-to-t from-primary-500 to-primary-400">
  <div class="card-header">
    <p class="text-center h1 font-zagoth">
      <Special special={title=="Fams 11"}>
        {title}
      </Special>
    </p>
  </div>

  <section class="flex flex-col justify-center items-center">
    <slot/>
  </section>
</div>


