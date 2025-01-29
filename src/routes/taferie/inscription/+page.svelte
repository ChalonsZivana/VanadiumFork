<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import MyButton from "$lib/components/miscellaneous/MyButton.svelte";
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  export let form;
  let dialog: HTMLDialogElement;
  onMount(() => {
    if (form) dialog.show();
  });
</script>

<div class="w-11/12 h-full items-center flex">
  <form
    method="post"
    use:enhance
    name="login"
    action="/taferie/inscription?/inscription"
    class="w-full"
  >
    <SectionCard title="Inscriptions">
      <div class="text-black w-full flex flex-col gap-2 items-center">
        <label class="w-11/12">
          <p class="font-zagoth text-white text-xl">Adresse mail :</p>
          <input
            required
            type="email"
            name="email"
            class="w-full rounded-md p-1"
          />
        </label>
        <label class="w-11/12">
          <p class="font-zagoth text-white">Nums :</p>
          <input
            required
            type="number"
            name="nums"
            class="w-full rounded-md p-1"
          />
        </label>
        <label class="w-11/12">
          <p class="font-zagoth text-white">Proms :</p>
          <input
            required
            type="number"
            name="proms"
            value={form?.proms ?? ""}
            class="w-full rounded-md p-1"
          />
        </label>
        <label class="w-11/12">
          <p class="font-zagoth text-white">Montant sur le compte :</p>
          <input
            required
            type="number"
            name="solde"
            value={form?.solde ?? ""}
            class="w-full rounded-md p-1"
          />
        </label>
        <label class="w-11/12">
          <p class="font-zagoth text-white">Prénom :</p>
          <input
            required
            type="text"
            name="prenom"
            class="w-full rounded-md p-1"
          />
        </label>
        <label class="w-11/12">
          <p class="font-zagoth text-white">Nom :</p>
          <input
            required
            type="text"
            name="nom"
            class="w-full rounded-md p-1"
          />
        </label>
        <label class="w-11/12">
          <p class="font-zagoth text-white">Bucque :</p>
          <input
            type="text"
            name="bucque"
            class="w-full rounded-md p-1"
            placeholder="SQRT"
          />
        </label>
      </div>

      <MyButton value="Créer le compte" callback={() => dialog.show()} />
    </SectionCard>
  </form>
</div>

<dialog
  bind:this={dialog}
  on:animationend={() => dialog.close()}
  class="fixed bottom-14 p-3 overflow-clip rounded-xl open:animate-fade-in"
>
  {#if form?.success}
    <p class="text-green-500 text-xl p-1 bg-white">Le PG a été créé.</p>
  {:else}
    <p class="text-red-500 text-xl p-1 bg-white">
      {#if form?.["already exists"]}
        Ce PG existes déja
      {/if}
    </p>
  {/if}
</dialog>
