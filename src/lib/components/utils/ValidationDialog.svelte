<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";
    import MyButton from "./MyButton.svelte";

  	export let showModal:boolean; // boolean
    export let title:string;
    export let content:string;
    export let callback:MouseEventHandler<HTMLButtonElement>;

    let dialog:HTMLDialogElement; // HTMLDialogElement

    $: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
  class="w-80 h-96 rounded-xl bg-yellow-200 text-black"
>
<div class="h-full flex flex-col">
  <div class="flex justify-between w-full h-16">
    <img class="w-16" src="/svgs/warning.svg" alt="warning">
    <img class="w-16" src="/svgs/warning.svg" alt="warning">
  </div>
  <div class="h-80 p-5 flex flex-col justify-between items-center">
    <p class="text-3xl text-center font-zagoth">{title}</p>
    <p class="font-bold text-3xl">Es-tu sûr ?</p>
    <p class="text-xl">{content}</p>

    <div class="flex gap-10">
      <MyButton callback={callback} value="Accepter"/>
      <MyButton callback={()=>dialog.close()} value="Annuler" color="bg-red-500"/>
    </div>
  </div>
</div>


</dialog>