<script lang="ts">
  let bouteilles = [
    { nom: "Bouteille 1", prix: 10 },
    { nom: "Bouteille 2", prix: 20 },
    { nom: "Bouteille 3", prix: 30 },
    { nom: "Bouteille 4", prix: 40 },
    { nom: "Bouteille 5", prix: 50 },
    { nom: "Bouteille 6", prix: 60 },
    { nom: "Bouteille 7", prix: 70 },
    { nom: "Bouteille 8", prix: 80 },
    { nom: "Bouteille 9", prix: 90 },
    { nom: "Bouteille 10", prix: 100 },
  ];
</script>

<div
  class="w-full h-full bg-kave-bg bg-cover bg-center flex flex-col gap-20 divide-y-4 divide-black"
>
  <p class="font-zagoth text-center text-8xl">K've</p>
  <div class="grid grid-cols-2 place-items-center overflow-scroll flex-grow">
    {#each bouteilles as bouteille}
      <div
        class="aspect-square w-40 z-50 bg-black bg-opacity-70 rounded-lg p-2 m-2 flex flex-col place-content-between place-items-center"
      >
        <p class="font-zagoth text-2xl">{bouteille.nom}</p>
        <img src="/images/wine_bottle.png" alt="" srcset="" />
        <p class="bg-orange-300 rounded-lg text-center text-black w-full">
          {bouteille.prix}€
        </p>
      </div>
    {/each}
  </div>
</div>
