<script lang="ts">
  export let data;

  const remove = (id:number)=>{
    data.discale = data.discale.filter(e=>e.id != id)
    fetch("/discale",
    {
      method:"POST",
      body:id.toString()
    }
    )
  }
</script>

<div class="flex flex-col w-screen">
  <div class="h-28 flex flex-col justify-center items-center">
    <p class="font-zagoth text-4xl text-white">Discale</p>
  </div>
  <div class="flex flex-col gap-5 justify-center items-center">
    {#each data.discale as music}
      <div class="flex p-2 flex-col justify-center items-center text-white bg-red-950 w-11/12 gap-2">
        <p class="text-xl text-center">{music.titre_auteur}</p>
        <div class="flex gap-5">
          <a href={music.lien_musique}>
            <div class="bg-blue-600 w-fit p-2 rounded-lg">Accéder</div>
          </a>
          
          <button on:click={()=>remove(music.id)} class="bg-red-600 w-fit p-2 rounded-lg">Supprimer</button>

        </div>
      </div>
    {/each}
  </div>
</div>