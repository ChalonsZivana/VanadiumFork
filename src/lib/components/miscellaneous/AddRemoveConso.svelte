<script lang="ts">
  import {enhance} from "$app/forms"
    import Icon from "@iconify/svelte";
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
  <input type="hidden" name="id" value={myId}>
  {#if annule == true || annule == 1}
    <button formaction="?/uncancel"  class="rounded-lg w-6 text-xl">
      <Icon icon="mdi:plus-box"/>
    </button>
  {:else}
    <button formaction="?/cancel"  class="rounded-lg w-6 text-xl">
      <Icon icon="mdi:minus-box"/>
    </button>
  {/if}
</form>

