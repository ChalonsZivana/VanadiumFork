import prisma from "$lib/prisma";
import { Boquette } from "$lib/server/classes/Boquette.js";
import {
  AddProductSchema,
  DeleteCategorySchema,
  DeleteProductSchema,
  EditProductSchema,
} from "$lib/zodSchema.js";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const id_boquette = parseInt(params.id_boquette);

  if (isNaN(id_boquette)) throw error(404);

  const boquette = await prisma.boquettes.findFirst({ where: { id_boquette } });
  if (boquette == null) throw error(404);

  return {
    boquette,
    produits: await prisma.produits.findMany({ where: { id_boquette } }),
    categories: await prisma.categories.findMany({ where: { id_boquette } }),
  };
}

export const actions = {
  addProduct: async ({ request, params }) => {
    const id_boquette = parseInt(params.id_boquette);

    const d = Object.fromEntries(await request.formData());
    const data = AddProductSchema.safeParse(d);
    if (!data.success) throw error(400);

    const boq = new Boquette(id_boquette);
    await boq.addProduct(data.data);
    return { success: true };
  },
  editProduct: async ({ request, params }) => {
    const id_boquette = parseInt(params.id_boquette);

    const d = Object.fromEntries(await request.formData());
    const data = EditProductSchema.safeParse(d);
    if (!data.success) throw error(400);
    const boq = new Boquette(id_boquette);
    boq.editProduct(data.data);
  },
  deleteProduct: async ({ request, params }) => {
    const id_boquette = parseInt(params.id_boquette);

    const d = Object.fromEntries(await request.formData());
    const data = DeleteProductSchema.safeParse(d);
    if (!data.success) throw error(400);
    const boq = new Boquette(id_boquette);
    boq.deleteProduct(data.data);
  },
  deleteCategory: async ({ request, params }) => {
    const id_boquette = parseInt(params.id_boquette);

    const d = Object.fromEntries(await request.formData());
    const data = DeleteCategorySchema.safeParse(d);
    if (!data.success) throw error(400);
    const boq = new Boquette(id_boquette);
    boq.deleteCategory(data.data);
  },
};
