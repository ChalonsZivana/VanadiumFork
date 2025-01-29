<script lang="ts">
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { onMount } from "svelte";

  export let dialog: HTMLDialogElement;
  export let title: string;
  export let formAction: string | null = null;
  export let buttonText: string = "texte manquant";
  export let onsubmit = () => {};

  let _form: HTMLFormElement;
  export let customEnhance:
    | SubmitFunction<
        Record<string, unknown> | undefined,
        Record<string, unknown> | undefined
      >
    | undefined = undefined;

  onMount(() => {
    if (customEnhance != undefined) {
      enhance(_form, customEnhance);
    } else {
      enhance(_form);
    }
  });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this={dialog}
  on:click|self={() => dialog.close()}
  class="w-full p-10 variant-filled-surface backdrop:backdrop-blur-sm rounded-xl"
>
  <p class="font-zagoth text-3xl text-center text-white">{title}</p>
  <form
    bind:this={_form}
    on:submit={() => {
      dialog.close();
      onsubmit();
    }}
    action={formAction}
    method="post"
  >
    <slot />

    <div class="flex justify-around gap-5 mt-5 text-white text-lg">
      <div class="flex justify-around gap-5 mt-5 text-white text-lg">
        <slot name="submitButton">
          <button class="btn variant-filled-primary">{buttonText}</button>
        </slot>
        <button
          class="btn variant-filled-error"
          type="button"
          on:click={() => dialog.close()}>annuler</button
        >
      </div>
    </div>
  </form>
</dialog>
