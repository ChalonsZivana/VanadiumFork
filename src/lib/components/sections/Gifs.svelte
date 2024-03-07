<script lang="ts">
  import SectionCard from "../SectionCard.svelte";

  export let photo:string;

  function handle(){}
</script>

<SectionCard title="">
  <img src={photo} alt={photo}>
</SectionCard>