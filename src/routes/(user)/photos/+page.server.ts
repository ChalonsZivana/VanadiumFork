import type { PageServerLoad } from "../$types";
import { error, fail } from "@sveltejs/kit";
import { deleteImage, listImages, uploadImage } from "$lib/r2";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.session.data.user) throw error(400);
  const images = await listImages();

  const urls = images.map((e) => ({
    key: e.key,
    url: `${url.origin}/photos/getImage?key=${e.key}`,
  }));
  return { photos: urls };
};

export const actions = {
  uploadPhoto: async ({ request, locals }) => {
    if (!locals.session.data.user) return fail(400);
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("photo") as File;

    // Check if a file was uploaded
    if (!file || !file.name) {
      return { success: false, error: "No file uploaded" };
    }

    await uploadImage(file, locals.session.data.user);

    return { success: true };
  },
  deletePhoto: async ({ request, locals }) => {
    //2625=89cH223
    if (!locals.session.data.user || locals.session.data.user.pg.id_pg !== 2625)
      return fail(400);

    const formData = await request.formData();
    const photoSrc = formData.get("photoSrc") as string;

    // Check if a file was uploaded
    if (!photoSrc) {
      return { success: false, error: "No file uploaded" };
    }

    await deleteImage(photoSrc);

    return { success: true, photoSrc };
  },
};
