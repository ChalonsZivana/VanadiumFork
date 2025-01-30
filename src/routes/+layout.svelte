<script lang="ts">
  import { popupStore } from "$lib/stores/popupStore";
  import "../app.css";
  import {
    initializeStores,
    Toast,
    getToastStore,
    type ToastSettings,
  } from "@skeletonlabs/skeleton";

  initializeStores();
  $: {
    if ($popupStore !== null) {
      for(let toast of $popupStore){
        const t: ToastSettings = {
          message: toast.message,
          background: toast.success ? 'bg-green-500' : 'bg-red-500',
        };
        
        getToastStore().trigger(t);
      }
      
    }
  }
</script>

<Toast />

<div id="maindiv" class="relative w-screen h-screen">
  <slot />
</div>
