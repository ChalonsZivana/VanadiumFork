<script lang="ts">
  import MyButton from "./MyButton.svelte";
  import type { MouseEventHandler } from "svelte/elements";

  export let dialog:HTMLDialogElement;
  export let title:string;
  export let buttonText:string;
  export let callback:MouseEventHandler<HTMLButtonElement>;
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog bind:this={dialog} on:click|self={()=>dialog.close()} 
  class="w-full p-10 bg-red-800 backdrop:backdrop-blur-sm rounded-xl">
  <p class="font-zagoth text-3xl text-center text-white">{title}</p>

  <slot/>

  <div class="flex justify-around mt-5 text-white text-lg">
    <button on:click={callback} class="size-24 bg-blue-500 rounded-md">{buttonText}</button>
    <button on:click={()=>dialog.close()} class="size-24 bg-red-500 rounded-md">annuler</button>
  </div>
</dialog>