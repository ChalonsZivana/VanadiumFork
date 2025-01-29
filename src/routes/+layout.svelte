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
      const t: ToastSettings = {
        message: $popupStore?.message,
      };
      getToastStore().trigger(t);
    }
  }
</script>

<Toast />

<div id="maindiv" class="relative w-screen h-screen">
  <slot />
</div>
