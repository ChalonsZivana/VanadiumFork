<script lang="ts">
  import Icon from "@iconify/svelte"
  import type {suivi_onscrits} from '@prisma/client'
  import {enhance} from '$app/forms'

  export let form:{onscrit:suivi_onscrits};
  export let data;


  let onscrit:{nums:number, data:{[key: string]: { comments: string; f: number[];}}};
  let data_modified:typeof onscrit.data;
  let data_temoin:typeof onscrit.data;
  $: {
    if(form && form.onscrit){    
      console.log('update')  
      onscrit = {nums:form.onscrit.nums,data:form.onscrit.data as {[key: string]: { comments: string; f: number[];}}};
    }
  }

  $:{
    if(onscrit && onscrit.data){
      console.log('update2')  

      data_modified = JSON.parse(JSON.stringify(onscrit.data))
      data_temoin = JSON.parse(JSON.stringify(onscrit.data))

      const date = new Date().toLocaleDateString('fr-FR')
      if(!(date in data_modified)){
        data_modified[date] = {comments:'', f:[]}
      }
    }
  }
  

  let tableContainer:HTMLDivElement;

  function scrollToBottom(){
    if (tableContainer && onscrit) {
      tableContainer.scroll({
        top:tableContainer.scrollHeight * 1000,
        behavior:"smooth"
      })
    }
  }

  function updateComment(index: string, newComment: string) {
    if(!onscrit) return
    data_modified[index].comments = newComment
  }
  $:{
    if(tableContainer){
      scrollToBottom();
    }
  }

  function compareContents(){
    let new_data:typeof onscrit.data = {}
    for(let [key, value] of Object.entries(onscrit.data)){
      console.log(data_temoin[key], value)
      if(key in data_temoin && data_temoin[key].comments == value.comments){
        continue
      }
      new_data[key] = value;
    }
    return new_data;
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
                    {#each Object.entries(data_modified)  as [date, data]}
                      <tr>
                        <td>{date}</td>

                        <td><textarea on:input={(e)=>updateComment(date, e.currentTarget.value)} class="textarea p-1" rows="5" value={data.comments??''}/></td>
                        <td><p>{data.f}</p></td>
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
              const new_data = compareContents();
              console.log(new_data)
              formData.set('data', JSON.stringify(new_data))
              setTimeout(scrollToBottom, 300);
              return ({})=>{};
            }}>
            <input type="hidden" value={onscrit.nums} name="nums">
              <button class="btn-icon variant-filled-primary">
                <Icon icon="mdi:content-save"/>
              </button>
            </form>
        {/if}
      </div>
  {/if}
</div>