<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte"; 
  import Planning from '$lib/components/svgs/planning.svelte';
  import QuestionPerson from '$lib/components/svgs/question-person.svelte';
</script>

<div class="flex flex-col items-center gap-10">
  <p class="text-white font-zagoth text-6xl">Usin's</p>
  <div class="aspect-square w-full flex flex-col gap-5 items-center justify-items-center ">
    
    
    <div class="w-80 aspect-square">
      <SectionCard title='Ordre du jour'>
        <p>Introduction du mot shymen, début de la période ayat</p>
      </SectionCard>
    </div>
    
    <div class="flex gap-4">
      <a href="/usins/onscrits">
        <SectionCard title='.onscrits'>
          <div class="w-24">
            <QuestionPerson/>
          </div>
          
        </SectionCard>
      </a>

      <!-- <a class="" href="/usins/planning">
        <SectionCard title='Planning'>
          <div class="w-24">
            <Planning/>
          </div>
        </SectionCard>
      </a> -->
    </div>
  </div>
</div>