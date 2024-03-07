<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import Button from '$lib/components/miscellaneous/MyButton.svelte';
  const onscrits:{[index:string]:string} = {
    '89':"89;Gerard;Louis-Matthieu;17+72=89\n19+80=89"
  }

  function createOnscrit(onscrit:string):Onscrit{
    let a = onscrit.split(';')
    return {
      'nums':a[0],
      'nom':a[1],
      'prenom':a[2],
      'compil':a[3],
    }
  }

  let searchText = '';
  let currentOnscrit:Onscrit|null = null;
  currentOnscrit = createOnscrit(onscrits['89']);

  interface Onscrit {
    nom:String;
    prenom:String,
    nums:String,
    compil:String
  }
  

  function handleSearch(){
    hideOnscrit = !hideOnscrit;

    let onscrit = onscrits[searchText];

    if(onscrit != undefined){
      currentOnscrit = createOnscrit(onscrit);
    }
  }

  function boutonFourchettage(){

  }

  let hideOnscrit = true;

</script>

<div class="relative h-screen flex flex-col justify-around items-center translate-y-50">

  {#if currentOnscrit==null}
    <form on:submit={handleSearch}>
      <input class="p-1 rounded-md" bind:value={searchText} type="number" placeholder="rechercher un .onscrit">
      <input class="text-2xl" type="submit" value="🔍">
    </form>
  {/if}
  
    
  {#if currentOnscrit!=null}
    <div class="relative">
      <SectionCard title="{currentOnscrit.nums}ch..3">
        <button on:click={()=>currentOnscrit=null} class="absolute top-1 right-1 w-5">
          <img src="/svgs/cross-circle-svgrepo-com.svg" alt="">
        </button>

        <div class="flex flex-col">
          <p>Nom: {currentOnscrit.nom}</p>
          <p>Prénom: {currentOnscrit.prenom}</p>
          <p>Compil: {currentOnscrit.compil}</p>
        </div>

        <Button value="Je l'ai fourchetté" callback={()=>{}}/>
        <Button value="ajouter un commentaire" callback={()=>{}}/>
      </SectionCard>
    </div>
  {/if}

  
</div>