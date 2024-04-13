<script lang="ts">
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { onMount } from "svelte";
  import type { MouseEventHandler } from "svelte/elements";

  export let dialog:HTMLDialogElement;
  export let title:string;
  export let formAction:string | null = null;
  export let callback:MouseEventHandler<HTMLButtonElement>|null = null;
  export let buttonText:string;
  
  let _form:HTMLFormElement;
  export let customEnhance:SubmitFunction<Record<string, unknown> | undefined, Record<string, unknown> | undefined> | undefined= undefined;

  onMount(()=>{
    if(customEnhance != undefined){
      enhance(_form, customEnhance)
    } else {
      enhance(_form)
    }
  })
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog bind:this={dialog} on:click|self={()=>dialog.close()} 
  class="w-full p-10 bg-red-800 backdrop:backdrop-blur-sm rounded-xl">
  <p class="font-zagoth text-3xl text-center text-white">{title}</p>
  <form  bind:this={_form} on:submit={()=>dialog.close()} action={formAction} method="post">
    <slot/>
    <div class="flex justify-around mt-5 text-white text-lg">
      {#if formAction != null}
        <button on:click={callback} class="size-28 bg-blue-500 rounded-md">{buttonText}</button>
      {:else}
        <button type="button" on:click={callback} class="size-28 bg-blue-500 rounded-md">{buttonText}</button>
      {/if}
      <button type="button" on:click={()=>dialog.close()} class="size-28 bg-red-500 rounded-md">annuler</button>
    </div>
  </form>
</dialog>