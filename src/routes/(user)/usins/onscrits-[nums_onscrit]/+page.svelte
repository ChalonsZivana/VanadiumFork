<script lang="ts">
  import Icon from "@iconify/svelte"
  import type {suivi_onscrits} from '@prisma/client'
  import {enhance} from '$app/forms'

  export let data;




  // let onscrit:{nums:number, fourchettages:{[key: string]: number[]}, comments:{[key:string]:string}};
  let data_modified:{[key:string]:string} = data.onscrit?.comments;
  let combinedKeys:string[] = [...Object.keys(data.onscrit.fourchettages), ...Object.keys(data.onscrit.comments)];
  combinedKeys = Array.from(new Set(combinedKeys));
  combinedKeys.sort();

  data_modified = data.onscrit.comments
  const date = new Date().toLocaleDateString('fr-FR')
  if(!(date in data_modified)){
    data_modified[date] = ""
  }

  let tableContainer:HTMLDivElement;

  function scrollToBottom(){
    if (tableContainer && data.onscrit) {
      tableContainer.scroll({
        top:tableContainer.scrollHeight * 1000,
        behavior:"smooth"
      })
    }
  }

  function updateComment(index: string, newComment: string) {
    if(!data.onscrit) return
    data_modified[index] = newComment
  }
  $:{
    if(tableContainer){
      scrollToBottom();
    }
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="h-full flex flex-col items-center justify-center">
  
    <div class="flex flex-col justify-center gap-8 items-center flex-grow pb-4">
      
      <form use:enhance action="?/fourchette" method="post">
        <input type="hidden" name="nums" value={data.onscrit.nums}>
        <button class="btn variant-filled-primary text-xl">
          <span> <Icon icon="mdi:silverware-fork" />   </span>
           <span>fourchetté</span>
        </button>
      </form>
        <div class="card w-80 flex flex-col">
          <div class="card-header">
            <p class="text-center h1">        {data.onscrit.nums}        </p>
          </div>
          <section>
            <div bind:this={tableContainer} class="table-container h-96">
              <!-- Native Table Element -->
              <table  class="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Commentaire</th>
                    <th>Fourchettage</th>
                  </tr>
                </thead>
                <tbody>
                    {#each combinedKeys  as date}
                      <tr>
                        <td>{date}</td>

                        <td><textarea on:input={(e)=>updateComment(date, e.currentTarget.value)} class="textarea p-1" rows="5" bind:value={data_modified[date]}/></td>
                        <td><p>{data.onscrit.fourchettages[date]??''}</p></td>
                      </tr>
                    {/each}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <!-- 23 == Boquette Ser'C -->
        {#if data.BOQUETTES.find(e => e.id_boquette == 23) !== undefined}
            <form method="post" action="?/set_onscrit" use:enhance={({formData})=>{
              formData.set('comments', JSON.stringify(data_modified))
              setTimeout(scrollToBottom, 300);
              return ({})=>{};
            }}>
            <input type="hidden" value={data.onscrit.nums} name="nums">
              <button class="btn-icon variant-filled-primary">
                <Icon icon="mdi:content-save"/>
              </button>
            </form>
        {/if}
      </div>
</div>