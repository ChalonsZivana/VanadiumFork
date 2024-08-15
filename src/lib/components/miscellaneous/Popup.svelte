<script lang="ts">
 
  export let form:{success:boolean, message:string}|{success:boolean, message:string}[]

  let dialog:HTMLDialogElement;

  $:{
    if(dialog && form){
      dialog.show()
    }
  }
</script>

<dialog bind:this={dialog} 
on:animationend={()=>dialog.close()}
class="z-50 fixed w-11/12 bottom-14 bg-yellow-200 p-3 overflow-clip rounded-xl open:animate-fade-in">
  {#if form}
    {#if Array.isArray(form)}
    {#each form as f}
      <p class="{f.success ? 'text-green-500':'text-red-500'} text-xl p-1 ">
        {f.message}
      </p>
    {/each}
    {:else}
      <p class="{form.success ? 'text-green-500':'text-red-500'} text-xl p-1">
        {form.message}
      </p>
    {/if}
  {/if}
</dialog>

