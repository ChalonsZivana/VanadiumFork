<script lang="ts">
  import SectionCard from "../SectionCard.svelte";

  let tops = {
    "Global":["Mars-L", "Skoü","Lapince"],
    "Foy's":[],
    "Auberge":[],
    "Strass Choco":[],
    "Mousse":[],
    "Copalerie":[],
    "Cock's":[],
    "Koenettrie":[],
    "K've":[],
  }
</script>

<SectionCard 
  title="Top consommateurs les 15 derniers jours">
  <div class="w-full flex flex-col justify-center items-center">
    {#each Object.entries(tops) as [topName, topList]}
      <p>{topName}</p>
      <div class="w-full">
        {#each topList as item, i (i)}
          <div class="w-40">{i + 1}: {item}</div>
        {/each}
      </div>
    {/each}
  </div>
  
</SectionCard>

