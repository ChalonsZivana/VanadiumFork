<script lang="ts">
  import Special from "./miscellaneous/Special.svelte";

  export let title: string;
</script>

<div
  class="card relative bg-gradient-to-t from-primary-700 to-primary-500"
>
  <div class="card-header flex justify-center">
    <span class="text-center h1 font-zagoth">
      <Special special={title == "Fams 11"}>
        <p>{title}</p>
      </Special>
    </span>
  </div>

  <section class="flex flex-col justify-center items-center gap-4 p-4">
    <slot />
  </section>
</div>
