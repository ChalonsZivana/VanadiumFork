<script lang="ts">
  import {enhance} from "$app/forms"
  import AddSquare from "../svgs/add-square.svelte";
  import MinusSquare from "../svgs/minus-square.svelte";
  export let id:number;
  export let annule:boolean|null|number;

  let myId = id;
</script>


<form method="post" use:enhance={
  async ()=>{
    return async({update})=> update({reset:false});
  }
}>
  <input type="number" value={myId} name="id" class="hidden">
  {#if annule == true || annule == 1}
    <button formaction="?/uncancel"  class="rounded-lg w-6">
      <AddSquare/>
    </button>
  {:else}
    <button formaction="?/cancel"  class="rounded-lg w-6">
      <MinusSquare/>
    </button>
  {/if}
</form>

