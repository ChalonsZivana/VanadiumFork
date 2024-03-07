<script lang="ts">
  export let auto:number|null=null;
  export let green:number|null=null;
  export let red:number|null=null;
  export let myClass:string='';

  if(auto){
    if(auto >= 0) green = auto
    else red = auto
  }
</script>

{#if green}
  <p class='text-green-500 {myClass}'>
    <slot/>+{green}€
  </p>
{:else if red}
  <p class='text-red-500 {myClass}'>
    <slot/>{red}€
  </p>
{/if}
