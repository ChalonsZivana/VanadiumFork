<script lang="ts">
  import { enhance } from "$app/forms";
  import { triggerPopupForm } from "$lib/stores/popupStore.js";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import {Accordion, AccordionItem} from "@skeletonlabs/skeleton";

  export let data;
  export let form: { success: boolean; message: string };

  const originDate = (data.date ?? new Date()).getTime();
  let timeout: number | null = null;
  let phoneNumber: string;
  onMount(() => {
    if (data.verify) {
      let a = setInterval(() => {
        timeout = Math.floor(120 - (new Date().getTime() - originDate) / 1000);
        if (timeout < 0) {
          timeout = 0;
          clearInterval(a);
        }
      }, 1000);
    }

    phoneNumber = localStorage.getItem("phoneNumber") ?? "";
  });

  $: triggerPopupForm(form);
</script>

<div class="w-full h-full flex flex-col items-center gap-5 p-5">
  <Accordion class="card variant-filled-surface max-w-96"  autocollapse>
      <AccordionItem open>
        <svelte:fragment slot="summary">
          <p class="font-zagoth h2 text-center">Rechargement Lydia</p>
        </svelte:fragment>
        <svelte:fragment slot="content">
          {#if !data.verify}
            <form
              class="p-4 flex flex-col gap-4 place-items-center place-content-center"
              on:submit={() => localStorage.setItem("phoneNumber", phoneNumber)}
              use:enhance
              action="?/createLydiaDemand"
              method="post"
            >
              <section class="flex flex-col gap-4 items-center">
                <div class="card variant-filled-warning p-2">
                  <p>
                    Rentrez votre numéro de téléphone (associé à votre compte Lydia), si
                    celui-ci n'est pas relié alors vous recevrez un SMS pour pouvoir
                    payer en ligne. Sinon, acceptez le paiement sur la plateforme Lydia.
                  </p>
                </div>
                <label>
                  <span>Numéro de téléphone Lydia</span>
                  <input required class="input" type="number" name="tel" />
                </label>
                <label>
                  <span>Montant (minimum 15€)</span>
                  <input required class="input" type="tel" name="montant" min="15" />
                </label>
              </section>

              <div class="card-footer flex justify-center">
                <button class="btn variant-filled-tertiary w-32 text-3xl">
                  <Icon icon="mdi:payment" />
                </button>
              </div>
            </form>
          {:else}
            <form
              class="card p-4 variant-filled-surface flex flex-col gap-4"
              on:submit={() => localStorage.setItem("phoneNumber", phoneNumber)}
              use:enhance
              action="?/verifyLydiaDemand"
              method="post"
            >
              <p class="card-header text-3xl font-zagoth text-center">
                Vérification Rechargement
              </p>
        
              <section class="flex flex-col gap-4 items-center">
                <div class="card variant-filled-warning p-2">
                  <p class="text-center">
                    Une demande de rechargement a été effectuée, appuyez sur le bouton.
                  </p>
                </div>
                <p class="text-xl">
                  Temps restant: <span class="font-bold">
                    {#if timeout != null}
                      {timeout}
                    {/if}
                  </span>
                </p>
              </section>
        
              <div class="card-footer flex justify-center">
                <button class="btn variant-filled-tertiary text-xl">
                  Vérifier le rechargement
                </button>
              </div>
            </form>
          {/if}
        </svelte:fragment>
      </AccordionItem>
      <AccordionItem>
        <svelte:fragment slot="summary">
          <p class="font-zagoth h2 text-center">Rechargement Fam's</p>
        </svelte:fragment>
        <svelte:fragment slot="content">
          <form
          method="post"
          action="?/rechargementFams"
          class="p-4 variant-filled-surface flex flex-col gap-4 place-items-center place-content-center"
        >
          <section class="flex flex-col gap-4 items-center">
            <div class="card variant-filled-warning p-2">
              <p>L'argent sera déduit de votre compte Vanadium.</p>
            </div>
            <label class="w-full">
              <span>Montant (minimum 15€)</span>
              <input required class="input" type="number" min="15" name="montant" />
            </label>
            <label class="w-full">
              <span>Libelle</span>
              <input class="input" required type="text" name="libelle" />
            </label>
          </section>
      
          {#if data.USER.pg.can_buy}
            <div class="card-footer flex justify-center">
              <button class="btn variant-filled-tertiary w-32 text-3xl">
                <Icon icon="mdi:payment" />
              </button>
            </div>
          {:else}
            <div class="card-footer flex justify-center">
              <div class="btn break-words text-wrap w-full variant-filled-warning">
                Tu es trop en negats ou depuis trop longtemps.
              </div>
            </div>
          {/if}
        </form>
        </svelte:fragment>
      </AccordionItem>
      <AccordionItem>
        <svelte:fragment slot="summary">
          <p class="font-zagoth h2 text-center">Envoi de Brousoufs</p>
        </svelte:fragment>
        <svelte:fragment slot="content">
          <form
          method="post"
          action="?/envoiBrousoufs"
          class="p-4 variant-filled-surface flex flex-col gap-4 place-content-center place-items-center"
        >
          <section class="flex flex-col gap-4 items-center">
            <div class="card variant-filled-warning p-2">
              <p>L'argent sera déduit de votre compte Vanadium.</p>
            </div>
            <div class="flex">
              <label class="w-full">
                <span>Nums</span>
                <input
                  required
                  class="input p-1 text-center"
                  type="number"
                  min="1"
                  name="nums"
                />
              </label>
              <label class="w-full">
                <span>Proms</span>
                <input
                  required
                  class="input p-1 text-center"
                  type="number"
                  min="220"
                  name="proms"
                />
              </label>
            </div>
            <label class="w-full">
              <span>Montant</span>
              <input
                required
                class="input"
                type="number"
                min="0"
                step="0.01"
                name="montant"
              />
            </label>
            <label class="w-full">
              <span>Libelle</span>
              <input class="input" required type="text" name="libelle" />
            </label>
          </section>
      
          {#if data.USER.pg.can_buy}
            <div class="card-footer flex justify-center">
              <button class="btn variant-filled-tertiary w-32 text-3xl">
                <Icon icon="mdi:payment" />
              </button>
            </div>
          {:else}
            <div class="card-footer flex justify-center">
              <div class="btn break-words text-wrap w-full variant-filled-warning">
                Tu es trop en negats ou depuis trop longtemps.
              </div>
            </div>
          {/if}
        </form>
        </svelte:fragment>
      </AccordionItem>
  </Accordion> 
</div>
