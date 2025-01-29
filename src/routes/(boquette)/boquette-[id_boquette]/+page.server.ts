import { Boquette } from "$lib/server/classes/Boquette.js";
import { Taferie } from "$lib/server/classes/Taferie.js";
import {
  EditBoquetteSchema,
  ImportRhopseSchema,
  OnlyDateSchema,
} from "$lib/zodSchema.js";
import { error, fail, redirect } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { categories } from "@prisma/client";

export const load = async ({ params, locals }) => {
  const id_boquette = parseInt(params.id_boquette);
  if (isNaN(id_boquette)) throw error(404);

  // proms motivs == 224, proms actuelle == 223
  if (locals.session.data.user?.pg.proms === 224) {
    throw redirect(303, "/boquette-" + id_boquette + "/special/rhopses");
  } else if (locals.session.data.user?.pg.proms !== 223) {
    throw error(400);
  }
};

export const actions = {
  getDaysStat: async ({ request, params }) => {
    const id_boquette = parseInt(params.id_boquette);
    if (!id_boquette) throw error(400);
    const d = Object.fromEntries(await request.formData());
    const data = OnlyDateSchema.safeParse(d);

    if (!data.success)
      return fail(400, { success: false, message: "Something went wrong" });

    const today = data.data.date;
    today.setTime(today.getTime() + 120 * 60000);
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const consommations_count = await prisma.consommations.groupBy({
      by: "id_produit",
      where: {
        type: "pg_boq",
        to: id_boquette,
        date_conso: { gte: startOfDay, lte: endOfDay },
      },
      _count: true,
    });

    return {
      consommations_count,
    };
  },
  editBoquette: async ({ request, params }) => {
    const id_boquette = parseInt(params.id_boquette);
    if (!id_boquette) throw error(400);
    const d = Object.fromEntries(await request.formData());
    const data = EditBoquetteSchema.safeParse(d);
    if (!data.success)
      return fail(400, { success: false, message: "Something went wrong" });

    new Boquette(id_boquette).editBoquette(data.data);
  },
  import_rhopse: async ({ request, params, locals }) => {
    const id_boquette = parseInt(params.id_boquette);
    const rhopseur = locals.session.data.user;
    if (!id_boquette || !rhopseur) throw error(400);
    const rhopseur_string = `${rhopseur.pg.nums}ch${rhopseur.pg.proms}`;
    const d = Object.fromEntries(await request.formData());
    const data = ImportRhopseSchema.safeParse(d);
    if (!data.success)
      return fail(400, { success: false, message: "Something went wrong" });

    const results: Awaited<ReturnType<typeof Taferie.rhopse>>[] = [];

    for (let [id_pg, id_produit, quantite, rhopsePourUnAncien] of data.data
      .produits) {
      const conso = await Taferie.rhopse(
        {
          type: "pg_boq",
          from: id_pg,
          to: id_boquette,
          id_produit: id_produit,
          quantite: quantite,
          rhopse_ancien: rhopsePourUnAncien,
          rhopseur: rhopseur_string,
        },
        true,
      );
      results.push(conso);
    }
    return {
      results,
    };
  },
  doInventory: async ({ request, params }) => {
    const id_boquette = parseInt(params.id_boquette);
    if (!id_boquette) throw error(400);

    const totalsByCategory: Record<number, number> = {}; // Pour stocker les totaux par catégorie

    const categories = await prisma.categories.findMany({
      where: { id_boquette },
    });

    const inventory: (categories & { total: number })[] = [];
    for (let cat of categories) {
      let total = 0;
      const produits = await prisma.produits.findMany({
        where: { id_categorie: cat.id_categorie },
      });
      for (let produit of produits) {
        if (produit.inventaire == null) continue;
        total += produit.prix * produit.inventaire;
      }
      inventory.push({ ...cat, total });
    }

    return {
      inventory,
    };
  },
};
