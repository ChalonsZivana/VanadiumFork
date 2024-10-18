<script lang="ts">
   type FormType = { [key: string]: any}|{success:boolean, message:string}|{success:boolean, message:string}[];

  export let form:FormType;

  let dialog:HTMLDialogElement;


  const isSuccessForm = (form: FormType): form is { success: boolean; message: string } => {
    return form && 'success' in form && 'message' in form;
  };
  $:{
    if(dialog && form && isSuccessForm(form)){
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
