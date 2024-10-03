<script lang="ts">
    import Accept from "../svgs/accept.svelte";

    export let formaction:string;
    export let text:string;
    let toggle = false;
</script>

<div class="mt-5 text-white rounded-lg overflow-clip w-full">
  <button type="button" on:click={()=>toggle=!toggle} class="bg-red-700 font-zagoth text-2xl p-2 w-full">
    {text}
  </button>
  <div class="flex text-white {toggle?'h-10 scale-y-100':'h-0 scale-y-0'} origin-top duration-300">
    <button formaction={formaction} type="submit" class="bg-green-600 w-full flex justify-center items-center" on:click={()=>toggle=false}>
      <Accept className="text-3xl"/>
    </button>
  </div>
</div>