<script lang="ts">
  import { onMount } from 'svelte';
  //import OneSignal from 'react-onesignal';
  import OneSignal from '@nolanx/svelte-onesignal';
  onMount(()=>{
    OneSignal.init({ appId: '8c47c8d7-2816-439b-8b07-59217c8431a6' });
  })
  
  import "../app.css";
</script>

<!-- <svelte:head>
    <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
  <script>
    console.log('hello')
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(function(OneSignal) {
      OneSignal.init({
        appId: "8c47c8d7-2816-439b-8b07-59217c8431a6",
      });
    });
  </script>
</svelte:head> -->

<div class="relative w-screen h-screen bg-fixed bg-main-bg bg-center bg-cover backdrop-blur-3xl overflow-x-hidden">
  <slot/>
</div>
