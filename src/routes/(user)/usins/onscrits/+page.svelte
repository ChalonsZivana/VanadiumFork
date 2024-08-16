<script lang="ts">
  import Icon from "@iconify/svelte"
  import type {suivi_onscrits} from '@prisma/client'
  import {enhance} from '$app/forms'

  export let form:{onscrit:suivi_onscrits};
  export let data;

  let dialog:HTMLDialogElement;


  let onscrit:{nums:number, data:{[key: string]: { comments: string; f: number[];}}};
  $: {
    if(form && form.onscrit){
      console.log(form.onscrit.data)
      onscrit = {nums:form.onscrit.nums,data:form.onscrit.data as {[key: string]: { comments: string; f: number[];}}};
      console.log(onscrit)
    }
  }
  let new_comment:string = "";

  let tableContainer:HTMLDivElement;

  function scrollToBottom(){
    if (tableContainer && onscrit) {
      tableContainer.scroll({
        top:tableContainer.scrollHeight * 1000,
        behavior:"smooth"
      })
    }
  }

  function updateComment(index: number, newComment: string) {
    if(!onscrit) return
    onscrit.data[index].comments = newComment
  }
  $:{
    if(tableContainer){
      scrollToBottom();
    }
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="h-full flex flex-col items-center justify-center">
  <div class="h-40 flex justify-center items-center">
    <form method="post" use:enhance action="?/get_onscrit" class="text-4xl flex flex-col items-center">
      <input required type="number" placeholder="nums du .onscrit" class="input p-2 w-80 text-center" name="nums" min="1" max="150">
      <button class="btn-icon text-4xl">
        <Icon icon="mdi:search"/>
      </button>
    </form>
  </div>
  {#if onscrit}
    <div class="flex flex-col justify-center gap-8 items-center flex-grow pb-4">
      
      <form use:enhance action="?/fourchette" method="post">
        <input type="hidden" name="nums" value={onscrit.nums}>
        <button class="btn variant-filled-primary text-xl">
          <span> <Icon icon="mdi:silverware-fork" />   </span>
           <span>fourchetté</span>
        </button>
      </form>
        <div class="card w-80 flex flex-col">
          <div class="card-header">
            <p class="text-center h1">        {onscrit.nums}        </p>
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
                    {#each Object.entries(onscrit.data)  as [date, data], index}
                      <tr>
                        <td>{date}</td>

                        <td><textarea on:input={(e)=>updateComment(index, e.currentTarget.value)} class="textarea p-1" rows="5" value={data.comments}/></td>
                      </tr>
                    {/each}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <!-- 23 == Boquette Ser'C -->
        {#if data.BOQUETTES.find(e => e.id_boquette == 23) !== undefined}
          <button class="btn-icon variant-filled-primary" on:click={()=>dialog.showModal()}>
            <Icon icon="mdi:add-bold"/>
          </button>
        {/if}

        
      </div>
  {/if}


</div>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog class="card w-11/12 h-96" bind:this={dialog} on:click|self={() => dialog.close()}>
  {#if onscrit}
    <form on:submit={()=>dialog.close()} method="post" use:enhance={({formData})=>{
      if(new_comment != ''){
        const date = new Date().toLocaleDateString('fr-FR')
        onscrit.data = {...onscrit.data, 
          date: {
            comments:new_comment, 
            f:[]
          }
        }
      }
      
      new_comment = '';
      formData.set('data', JSON.stringify(onscrit.data))
      setTimeout(scrollToBottom, 300);
      return ({})=>{};
    }} action="?/set_onscrit" class="card size-full p-2 flex flex-col justify-between  gap-4 variant-filled-surface">  
      <div class="card-header flex justify-center text-xl">Nouveau commentaire</div>
      <input type="hidden" name="nums" value={onscrit.nums}>
      <textarea class="textarea" rows="5" bind:value={new_comment} name="data" placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit." />
      
      <div class="card-footer flex justify-center">
        <button class="btn-icon text-3xl">
          <Icon icon="mdi:content-save" />
        </button>
      </div>
    </form>
  {/if}
</dialog>