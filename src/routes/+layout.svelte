<script lang="ts">
  import "../app.css";
  export const data = {}; //init const data changed by load function
</script>


<div class="relative w-screen h-screen bg-fixed bg-main-bg bg-center bg-cover overflow-x-hidden">
  <slot/>
</div>