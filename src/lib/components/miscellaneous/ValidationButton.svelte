<script lang="ts">
  import Icon from "@iconify/svelte";

  export let formaction: string;
  export let text: string;
  let toggle = false;
</script>

<div class="mt-5 text-white rounded-lg overflow-clip w-full">
  <button
    type="button"
    on:click={() => (toggle = !toggle)}
    class="variant-filled-primary font-zagoth text-2xl p-2 w-full"
  >
    {text}
  </button>
  <div
    class="flex text-white {toggle
      ? 'h-10 scale-y-100'
      : 'h-0 scale-y-0'} origin-top duration-300"
  >
    <button
      {formaction}
      type="submit"
      class="bg-green-600 w-full flex justify-center items-center"
      on:click={() => (toggle = false)}
    >
      <Icon icon="subway:tick" class="text-3xl font-bold" />
    </button>
  </div>
</div>
