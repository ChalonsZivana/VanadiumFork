<script lang="ts">
  import SectionCard from "../section_card.svelte";

  export let photo:string;

  function handle(){}
</script>

<SectionCard title="">
  <img src={photo} alt={photo}>
</SectionCard>