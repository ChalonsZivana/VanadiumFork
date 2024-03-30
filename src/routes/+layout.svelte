<script lang="ts">
  import "../app.css";

  export let form;
  let dialog:HTMLDialogElement;
</script>

<div class="relative w-screen h-screen bg-fixed bg-main-bg bg-center bg-cover backdrop-blur-3xl overflow-x-hidden">
  <slot/>
</div>

{#if form}
<dialog bind:this={dialog} 
on:animationend={()=>dialog.close()}
class="fixed w-11/12 bottom-14 p-3 overflow-clip rounded-xl open:animate-fade-in">
{#if form?.ok}
  <p class="text-green-500 text-xl p-1 bg-white">
    {form.ok}
  </p>
{:else}
  <p class="text-red-500 text-xl p-1 bg-white">
    {#if form?.error}
     {form.error}
    {/if}
  </p>
{/if}
</dialog>
{/if}
