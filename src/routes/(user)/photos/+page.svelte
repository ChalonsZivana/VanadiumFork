<script lang="ts">
  import { enhance } from "$app/forms";
  import { triggerPopupForm } from "$lib/stores/popupStore.js";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  export let data;
  export let form: { success: boolean; message: string };

  let files: Blob;

  let dialogOpen = false;

  let fileInput: HTMLInputElement;
  let addPhotoDialog: HTMLDialogElement;
  let showPhotoDialog: HTMLDialogElement;

  $: previewUrl = "";

  let imageElements: HTMLImageElement[] = [];
  let observer:IntersectionObserver;
  
  let photosWithOrientations: {
    photo: (typeof data.photos)[0];
    mode: "landscape" | "portrait" | "square";
  }[] = [];
  let currentPhotoIndex: number | null = null;

  onMount(() => {
    photosWithOrientations = data.photos.map((photo) => {
      let image = new Image();
      image.src = photo.url;

      let mode: (typeof photosWithOrientations)[0]["mode"] = "square";
      if (image.naturalWidth > image.naturalHeight) {
        mode = "landscape";
      } else if (image.naturalWidth < image.naturalHeight) {
        mode = "portrait";
      }
      return { photo, mode };
    });

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!; // Set the real image source
            observer.unobserve(img); // Stop observing once loaded
          }
        }
      },
      { rootMargin: "100px" } // Preload images slightly before they appear
    );

  });
  $:imageElements.forEach((img) => {observer.observe(img)});

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement; // Type assertion for the target
    const file = target.files?.[0]; // Access the first file

    if (file) {
      const img = new Image(); // Create a new image object
      const reader = new FileReader(); // Create a new file reader

      // Load the image data
      reader.onload = (e: ProgressEvent<FileReader>) => {
        img.src = e.target?.result as string; // Type assertion for the result
      };

      img.onload = async () => {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Set the desired width and height
          const desiredWidth = img.width / 2; // Reduce width by half (or any factor)
          const desiredHeight = img.height / 2; // Reduce height by half (or any factor)

          canvas.width = desiredWidth;
          canvas.height = desiredHeight;

          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0, desiredWidth, desiredHeight);

          // Convert the canvas to a Blob in JPEG format with lower quality (0 to 1)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create a new File object in JPEG format
                const newFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, ".jpg"),
                  { type: "image/jpeg" },
                );
                previewUrl = URL.createObjectURL(newFile); // Update the preview URL
                files = newFile; // Save the new file for uploading
              }
            },
            "image/jpeg",
            0.5,
          ); // Set quality to 0.5 (50% quality)
        }
      };

      reader.readAsDataURL(file); // Read the file as a data URL
      addPhotoDialog.showModal();
    }
  }

  
  $: triggerPopupForm(form);
</script>

<div class="w-full h-full flex flex-col gap-2 p-2 place-items-center">
  <div
    class="flex-grow grid grid-flow-dense grid-cols-4 md:grid-cols-6 grid-rows-auto place-items-center place-content-center"
  >
    {#each photosWithOrientations as photo, i}
      <button
        on:click={()=>{
          currentPhotoIndex=i; 
          dialogOpen = true;
          }} class="relative size-full {photo.mode == 'landscape' ? 'col-span-2' : ''} flex place-items-center place-content-center transition-all duration-1000 border-black border-solid border-2"
      >
        <img
          bind:this={imageElements[i]}
          class="w-80  object-contain"
          data-src={photo.photo.url} 
          src="" 
          alt=""
        />
      </button>
    {/each}
  </div>

  <!-- Use absolute positioning for the button -->
  <label class="w-fit">
    <input
      hidden
      on:change={handleFileChange}
      bind:this={fileInput}
      type="file"
      accept="image/*"
      required
    />
    <div class="btn-sm rounded-xl variant-filled-primary">
      <Icon
        class="text-5xl"
        icon="material-symbols:add-photo-alternate-rounded"
      />
    </div>
  </label>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={addPhotoDialog}
  on:click|self={() => addPhotoDialog.close()}
  class="w-full p-10 bg-red-800 backdrop:backdrop-blur-sm rounded-xl"
>
  <p class="font-zagoth text-3xl text-center text-white">Envoyer Photo</p>
  <form
    use:enhance={async ({ formData }) => formData.set("photo", files)}
    on:submit={() => addPhotoDialog.close()}
    action="?/uploadPhoto"
    method="post"
    enctype="multipart/form-data"
  >
    <div class="flex justify-center">
      {#if previewUrl}
        <img
          src={previewUrl}
          alt="Selected file preview"
          class="w-80 h-auto mt-4"
        />
      {/if}
    </div>

    <div class="flex justify-around gap-5 mt-5 text-white text-lg">
      <div class="flex justify-around gap-5 mt-5 text-white text-lg">
        <slot name="submitButton">
          <button class="size-20 bg-blue-500 rounded-md">Envoyer</button>
        </slot>
        <button
          class="size-20 bg-red-500 rounded-md"
          type="button"
          on:click={() => addPhotoDialog.close()}>annuler</button
        >
      </div>
    </div>
  </form>
</dialog>



{#if dialogOpen && currentPhotoIndex}
{@const curPhot = photosWithOrientations[currentPhotoIndex]}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|self={()=>dialogOpen=false} class="absolute h-full w-full flex place-items-center place-content-center">
    <div class="relative w-80 rounded-lg sm:w-1/2 flex">
      <img src={`${curPhot.photo.url}`} alt="">
      
      <!-- LeMe -->
      {#if data.USER.pg.id_pg == 2625}
        <form on:submit={()=>dialogOpen=false} use:enhance class="absolute top-0 right-0" method="post" action="?/deletePhoto">
          <input type="hidden" name="photoSrc" value={curPhot.photo.key} />
          <button><Icon class="text-3xl" icon="mdi:delete" /></button>
        </form>
      {/if}
    </div>
  </div>
{/if}
