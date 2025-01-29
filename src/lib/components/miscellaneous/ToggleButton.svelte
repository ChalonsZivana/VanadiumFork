<script lang="ts">
  export let isChecked: boolean;
  export let name: string;
</script>

<label class="flex items-center cursor-pointer w-fit text-white">
  <input type="checkbox" {name} class="sr-only" bind:checked={isChecked} />
  <div
    class="mr-4 relative w-14 h-8 {isChecked
      ? 'bg-blue-600'
      : 'bg-white'} rounded-full"
  >
    <div
      class="absolute top-1 left-1 w-6 h-6 {isChecked
        ? 'bg-white'
        : 'bg-gray-400'} rounded-full shadow-md transform transition-transform"
      class:translate-x-full={isChecked}
    ></div>
  </div>
  {name}
</label>
