<script lang="ts">
    import { invalidateAll } from "$app/navigation";
  import AppLayout from "$lib/components/AppLayout.svelte";
    import { oneshotaction } from "$lib/utils.js";
  export let data;

  async function handleSubmit(event: Event) {
		event.preventDefault(); // Prevents page reload

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

    const content = formData.get('content');
    if(content != data.requiredToUnlock){
      return;
    }

    fetch('/api/unlockaccount').then(e => invalidateAll());


	}
</script>


{#if data.requiredToUnlock != null}
  <form on:submit={handleSubmit} class="w-full p-4 h-full flex flex-col place-items-center place-content-center">
    <div class="flex select-none flex-col gap-4 card variant-filled-surface p-4 place-items-center place-content-center">
      <p class="text-3xl text-center">Ton compte est bloqué, suis la procédure ci-dessous pour le débloquer.</p>

      <label class="flex flex-col gap-4 ">
        Ecris ce texte: "{data.requiredToUnlock}"
        <input required class="input text-center" type="text" name="content">
      </label>
      <button use:oneshotaction class="btn variant-filled-primary text-wrap w-80">
        Je soussigné {data.USER.pg.nom} {data.USER.pg.prenom} certifie que je crois en ce que j'ai écris en âme et conscience
      </button>
    </div>
  </form>
{:else}
  <AppLayout
    bind:USER={data.USER}
    bind:BOQUETTES={data.BOQUETTES}
    bind:url={data.url}
  >
    <slot />
  </AppLayout>
{/if}
