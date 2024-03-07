<script lang="ts">
  export let toggle = false;
</script>

<div class="w-full">
  <button class="w-full h-full" on:click={()=>toggle = !toggle}>
    <slot name="head"/>
  </button>
  <div class="{toggle ? 'h-96':'h-0'} {toggle ? 'scale-y-100':'scale-y-0'} duration-300 origin-top">
    <slot name="body"/>
  </div>
</div>
