<script lang="ts">
  import Profile from "$lib/components/pg/UserProfile.svelte";
  import type { User } from "$lib/server/auth";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import MyButton from "$lib/components/miscellaneous/MyButton.svelte";
  import ValidationButton from "$lib/components/miscellaneous/ValidationButton.svelte";
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";

  export let data: { USER: User; photo: string; photosFolder: string };
  export let form;

  const dossiersGifs = {
    "gifs filles": "gif",
    "gifs garçons": "gifF",
    "gifs mixte": "gifHF",
    "photos animaux": "animaux",
    "photos filles": "jolie",
    "photos garçons": "jolieF",
    "photos motos": "moto",
    "photos paysage": "paysage",
    "photos voitures": "voiture",
    "photos katanas": "katanas",
    "photos Vana": "vana",
  };

  let currentFolder = data.photosFolder;
  const sendChange = () => {
    fetch("/profile", {
      method: "POST",
      body: JSON.stringify(currentFolder),
    });
  };
  // onMount(async ()=>{
  //   console.log(OneSignal)
  //   console.log(OneSignal.isPushNotificationsEnabled())
  // })
</script>

<div class="size-full flex justify-center items-center">
  <div
    class="mt-5 h-full w-80 md:w-11/12 flex flex-col md:grid gap-5 grid-cols-2 grid-rows-2"
  >
    <Profile user={data.USER}>
      <form method="post">
        <ValidationButton text="Se déconnecter" formaction="/login?/logout" />
      </form>
    </Profile>

    <SectionCard title="Dossier Gifs">
      <select
        bind:value={currentFolder}
        class="text-black w-80 text-2xl"
        on:change={sendChange}
      >
        {#each Object.entries(dossiersGifs) as [nom, dossier]}
          <option value={dossier}>{nom}</option>
        {/each}
      </select>
    </SectionCard>

    <form action="?/change_password" method="post">
      <SectionCard title="Changer de mot de passe">
        <input
          name="P"
          class="text-black rounded-md w-52"
          type="password"
          placeholder="Mot de passe"
        />
        {#if form?.wrong}
          <p class="text-red-500">Mauvais mot de passe</p>
        {/if}
        <input
          name="NP"
          class="text-black rounded-md w-52"
          type="password"
          placeholder="Nouveau mot de passe"
        />
        <input
          name="RP"
          class="text-black rounded-md w-52"
          type="password"
          placeholder="Confirme le mot de passe"
        />
        {#if form?.different}
          <p class="text-red-500">Les mots de passe sont différents</p>
        {/if}
        {#if form?.missing}
          <p class="text-red-500">Tous les champs sont obligatoires</p>
        {/if}
        <MyButton value="confirmer" />
      </SectionCard>
    </form>

    <form use:enhance action="?/ajouter_ancien" method="post">
      <SectionCard title="Gerer les anciens">
        {#if form?.wrong}
          <p class="text-red-500">Mauvais mot de passe</p>
        {/if}

        {#if form?.different}
          <p class="text-red-500">Les mots de passe sont différents</p>
        {/if}
        {#if form?.missing}
          <p class="text-red-500">Tous les champs sont obligatoires</p>
        {/if}

        <div class="flex flex-col">
          {#each data.USER.pg.anciens_autorises as a}
            <div class="flex justify-center items-center gap-4">
              <p>{a}</p>
              <button formaction="?/retirer_ancien" class="btn-icon">
                <input type="hidden" name="ancien" value={a} />
                <Icon icon="mdi:delete" />
              </button>
            </div>
          {/each}
        </div>

        <div class="flex gap-4 w-full justify-center">
          <label class="flex flex-col w-20">
            Num's
            <input
              class="input variant-filled-primary p-2 text-center"
              type="number"
              name="nums"
            />
            <button class="btn-icon"> </button>
          </label>
          <label class="flex flex-col w-20">
            Prom's
            <input
              class="input variant-filled-primary p-2 text-center"
              type="number"
              name="proms"
            />
          </label>
        </div>
        <MyButton value="ajouter" />
      </SectionCard>
    </form>
  </div>
</div>
