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

  $: previewUrl = "";

  let imageElements: HTMLImageElement[] = [];
  let observer: IntersectionObserver;

  let photosWithOrientations: {
    photo: (typeof data.photos)[0];
    mode: "landscape" | "portrait" | "square";
  }[] = [];

  let currentPhotoIndex: number | null = null;
  let searchQuery = "";
  let newTagInput = "";

  $: filteredPhotos = searchQuery.trim() === ""
    ? photosWithOrientations
    : photosWithOrientations.filter(({ photo }) =>
        photo.tags.some(t => t.tag.includes(searchQuery.trim().toLowerCase()))
      );

  onMount(() => {
    photosWithOrientations = data.photos.map((photo) => {
      let image = new Image();
      image.src = photo.url;
      let mode: (typeof photosWithOrientations)[0]["mode"] = "square";
      if (image.naturalWidth > image.naturalHeight) mode = "landscape";
      else if (image.naturalWidth < image.naturalHeight) mode = "portrait";
      return { photo, mode };
    });

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            observer.unobserve(img);
          }
        }
      },
      { rootMargin: "100px" }
    );
  });

  $: imageElements.forEach((img) => { if (observer && img) observer.observe(img); });

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => { img.src = e.target?.result as string; };
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const desiredWidth = img.width / 2;
          const desiredHeight = img.height / 2;
          canvas.width = desiredWidth;
          canvas.height = desiredHeight;
          ctx.drawImage(img, 0, 0, desiredWidth, desiredHeight);
          canvas.toBlob((blob) => {
            if (blob) {
              const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
              previewUrl = URL.createObjectURL(newFile);
              files = newFile;
            }
          }, "image/jpeg", 0.5);
        }
      };
      reader.readAsDataURL(file);
      addPhotoDialog.showModal();
    }
  }

  $: triggerPopupForm(form);
</script>

<!-- Search bar -->
<div class="w-full flex justify-center p-2">
  <input
    type="text"
    bind:value={searchQuery}
    placeholder="Rechercher par tag (nums, boquette, manip)..."
    class="input input-bordered w-full max-w-md rounded-lg px-3 py-2 border border-gray-400"
  />
</div>

<div class="w-full h-full flex flex-col gap-2 p-2 place-items-center">
  <div class="flex-grow grid grid-flow-dense grid-cols-4 md:grid-cols-6 grid-rows-auto place-items-center place-content-center">
    {#each filteredPhotos as photo, i}
      <button
        on:click={() => {
          currentPhotoIndex = photosWithOrientations.indexOf(photo);
          dialogOpen = true;
          newTagInput = "";
        }}
        class="relative size-full {photo.mode == 'landscape' ? 'col-span-2' : ''} flex place-items-center place-content-center transition-all duration-1000 border-black border-solid border-2"
      >
        <img
          bind:this={imageElements[i]}
          class="w-80 object-contain"
          data-src={photo.photo.url}
          src=""
          alt=""
        />
      </button>
    {/each}
  </div>

  <label class="w-fit">
    <input hidden on:change={handleFileChange} bind:this={fileInput} type="file" accept="image/*" required />
    <div class="btn-sm rounded-xl variant-filled-primary">
      <Icon class="text-5xl" icon="material-symbols:add-photo-alternate-rounded" />
    </div>
  </label>
</div>

<!-- Add photo dialog -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog bind:this={addPhotoDialog} on:click|self={() => addPhotoDialog.close()} class="w-full p-10 bg-red-800 backdrop:backdrop-blur-sm rounded-xl">
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
        <img src={previewUrl} alt="Selected file preview" class="w-80 h-auto mt-4" />
      {/if}
    </div>
    <div class="flex justify-around gap-5 mt-5 text-white text-lg">
      <button class="size-20 bg-blue-500 rounded-md">Envoyer</button>
      <button class="size-20 bg-red-500 rounded-md" type="button" on:click={() => addPhotoDialog.close()}>annuler</button>
    </div>
  </form>
</dialog>

<!-- Photo detail dialog -->
{#if dialogOpen && currentPhotoIndex !== null}
  {@const curPhot = photosWithOrientations[currentPhotoIndex]}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|self={() => dialogOpen = false} class="absolute h-full w-full flex place-items-center place-content-center top-0 left-0 bg-black/50 z-50">
    <div class="relative w-80 sm:w-1/2 flex flex-col gap-2 bg-white rounded-lg p-3">
      <img src={curPhot.photo.url} alt="" class="w-auto rounded" style="max-height: 75vh; object-fit: contain;" />

      <!-- Tags display -->
     <!-- Tags display -->
      <div class="flex flex-wrap gap-1">
        {#each curPhot.photo.tags as tag}
          <span class="flex items-center gap-1 bg-gray-200 rounded px-2 py-0.5 text-sm text-black">
            {tag.tag}
          </span>
        {/each}
      </div>

      <!-- Add tag -->
      <form use:enhance method="post" action="?/addTag" class="flex gap-2">
        <input type="hidden" name="image_key" value={curPhot.photo.key}/>
        <input
          type="text"
          name="tag"
          bind:value={newTagInput}
          placeholder="Ajouter un tag (nums, boquette, manip)..."
          class="border rounded px-2 py-1 text-sm flex-1 text-black"
        />
        <button type="submit" class="bg-blue-500 text-white rounded px-3 py-1 text-sm">+</button>
      </form>

      <!-- Delete photo (admin only) -->
      {#if data.USER.pg.id_pg == 2777}
        <form on:submit={() => dialogOpen = false} use:enhance class="self-end" method="post" action="?/deletePhoto">
          <input type="hidden" name="photoSrc" value={curPhot.photo.key} />
          <button class="text-red-600"><Icon class="text-3xl" icon="mdi:delete" /></button>
        </form>
      {/if}
    </div>
  </div>
{/if}