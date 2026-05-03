import type { PageServerLoad } from "../$types";
import { error, fail } from "@sveltejs/kit";
import { deleteImage, listImages, uploadImage } from "$lib/r2";
import prisma from "$lib/prisma"; // adjust to your prisma import path

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.session.data.user) throw error(400);

  const images = await listImages();
  const allTags = await prisma.photo_tags.findMany();

  const photos = images.map((e) => ({
    key: e.key,
    url: `${url.origin}/photos/getImage?key=${e.key}`,
    tags: allTags.filter(t => t.image_key === e.key).map(t => ({ id: t.id, tag: t.tag })),
  }));

  return { photos };
};

export const actions = {
  uploadPhoto: async ({ request, locals }) => {
    if (!locals.session.data.user) return fail(400);
    const formData = await request.formData();
    const file = formData.get("photo") as File;
    if (!file || !file.name) return { success: false, error: "No file uploaded" };
    await uploadImage(file, locals.session.data.user);
    return { success: true };
  },

  deletePhoto: async ({ request, locals }) => {
    if (!locals.session.data.user || locals.session.data.user.pg.id_pg !== 2777)
      return fail(400);
    const formData = await request.formData();
    const photoSrc = formData.get("photoSrc") as string;
    if (!photoSrc) return { success: false, error: "No file uploaded" };
    await deleteImage(photoSrc);
    return { success: true, photoSrc };
  },

  addTag: async ({ request, locals }) => {
    if (!locals.session.data.user) return fail(400);
    const formData = await request.formData();
    const image_key = formData.get("image_key") as string;
    const tag = (formData.get("tag") as string)?.trim().toLowerCase();
    if (!image_key || !tag) return fail(400, { success: false, message: "Missing fields" });

    // Avoid duplicate tags on the same photo
    const existing = await prisma.photo_tags.findFirst({ where: { image_key, tag } });
    if (existing) return { success: true }; // already exists, no-op

    await prisma.photo_tags.create({
      data: { image_key, tag, id_pg: locals.session.data.user.pg.id_pg },
    });
    return { success: true };
  },

  removeTag: async ({ request, locals }) => {
    if (!locals.session.data.user) return fail(400);
    const formData = await request.formData();
    const id = parseInt(formData.get("id") as string);
    if (!id) return fail(400);
    await prisma.photo_tags.delete({ where: { id } });
    return { success: true };
  },
};