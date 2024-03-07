<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte"; 
</script>

<div class="h-screen flex flex-col justify-around items-center">
  <p class="text-white font-zagoth text-6xl">Usin's</p>
  <div class="aspect-square h-4/6 grid gap-5 grid-rows-2 grid-cols-2 items-center justify-items-center ">
    
    <div class="aspect-square w-52">
      <SectionCard title='Ma journée'>
        <div class="flex flex-col justify-center">
          <p>Matin:</p>
          <p>Roten's:</p>
          <p>Soir:</p>
        </div>
      </SectionCard>
    </div>
    
    <div class="aspect-square w-52">
      <SectionCard title='Ordre du jour'>
        <p>Introduction du mot shymen, début de la période ayat</p>
      </SectionCard>
    </div>
    
    
  
    <div class="aspect-square w-52">
      <a href="/usins/onscrits">
        <SectionCard title='.onscrits'>
          <div class="w-24">
            <img src="/svgs/question-answer-help-svgrepo-com.svg" alt="">
          </div>
          
        </SectionCard>
      </a>
    </div>
    <div class="aspect-square w-52">
      <a href="/usins/planning">
        
        <SectionCard title='Planning'>
          <div class="w-24">
            <img src="/svgs/planning-svgrepo-com.svg" alt="">
          </div>
        </SectionCard>
      </a>
    </div>
  </div>
</div>