import { Boquette } from "$lib/server/classes/Boquette.js";
import { Taferie } from "$lib/server/classes/Taferie.js";
import { Fams } from "$lib/server/classes/Fams";
import {
  EditBoquetteSchema,
  ImportRhopseSchema,
  OnlyDateSchema,
} from "$lib/zodSchema.js";
import { error, fail } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { categories } from "@prisma/client";



export const load = async ({ params,locals }) => {
  const id_boquette = parseInt(params.id_boquette);
  if (isNaN(id_boquette)) throw error(404);

  const isTaferie = await prisma.appartenance_boquettes.findFirst({
    where:{id_boquette:20, id_pg:locals.session.data.user?.pg.id_pg}
  });

  return {
    isTaferie:isTaferie!=null
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

    type Ligne = [number | string, number, number, string | null];
    const lignes = data.data.produits as Ligne[];

    // lignes pg : [id_pg, ...] / lignes fam's : ["f27", ...]
    const lignesPg = lignes.filter(
      (l): l is [number, number, number, string | null] => typeof l[0] === "number",
    );
    const lignesFams = lignes
      .filter((l): l is [string, number, number, string | null] => typeof l[0] === "string")
      .map(([f, id_produit, quantite]) => ({
        nums: parseInt(f.slice(1)),
        id_produit,
        quantite,
      }));

    // fam's valides (1-50)
    const invalides = lignesFams.filter((l) => l.nums < 1 || l.nums > 50);
    if (invalides.length > 0)
      return fail(400, {
        success: false,
        message:
          `Import annulé, fam's invalide : ` +
          [...new Set(invalides.map((l) => `f${l.nums}`))].join(", "),
      });

    // les fam's sont-ils autorisés à rhopser ? (admin TAFerie : toujours)
    if (
      lignesFams.length > 0 &&
      !(await Taferie.isTaferie(rhopseur.pg.id_pg)) &&
      (await Taferie.famsZocque())
    ) {
      const noms = [...new Set(lignesFams.map((l) => `f${l.nums}`))].join(", ");
      return fail(403, {
        success: false,
        message: `Import annulé, les rhopses de fam's sont désactivées (${noms})`,
      });
    }

    // négat's zocqué : personne (pg ou fam's) ne doit finir en négatif
    if (await Taferie.negatsZocque()) {
      const idsProduits = [...new Set(lignes.map(([, id_produit]) => id_produit))];
      const produits = await prisma.produits.findMany({
        where: { id_produit: { in: idsProduits } },
        select: { id_produit: true, prix: true, prix2: true },
      });
      const prixParProduit = new Map(
        produits.map((p) => [p.id_produit, p.prix + p.prix2]),
      );

      const depensePg = new Map<number, number>();
      for (const [id_pg, id_produit, quantite] of lignesPg) {
        const prix = prixParProduit.get(id_produit);
        if (prix == null) continue; // produit inconnu : Taferie.rhopse renverra l'erreur
        depensePg.set(id_pg, (depensePg.get(id_pg) ?? 0) + quantite * prix);
      }

      // new Fams(n).ID normalise (ex: 9 -> 8) pour regrouper les lignes
      const depenseFams = new Map<number, number>();
      for (const l of lignesFams) {
        const prix = prixParProduit.get(l.id_produit);
        if (prix == null) continue;
        const id = new Fams(l.nums).ID;
        depenseFams.set(id, (depenseFams.get(id) ?? 0) + l.quantite * prix);
      }

      const pgs = await prisma.pg.findMany({
        where: { id_pg: { in: [...depensePg.keys()] } },
        select: { id_pg: true, nums: true, proms: true, solde: true },
      });
      const famsRows = await prisma.fams.findMany({
        where: { nums: { in: [...depenseFams.keys()] } },
      });

      const bloquants: string[] = [];
      for (const p of pgs) {
        const total = depensePg.get(p.id_pg) ?? 0;
        if (total > 0 && p.solde - total < 0)
          bloquants.push(
            `${p.nums}ch${p.proms} (solde ${p.solde.toFixed(2)}€, total ${total.toFixed(2)}€)`,
          );
      }
      for (const f of famsRows) {
        const total = depenseFams.get(f.nums) ?? 0;
        if (total > 0 && f.solde - total < 0)
          bloquants.push(
            `f${f.nums} (solde ${f.solde.toFixed(2)}€, total ${total.toFixed(2)}€)`,
          );
      }

      if (bloquants.length > 0)
        return fail(400, {
          success: false,
          message: `Import annulé, solde insuffisant pour : ` + bloquants.join(", "),
        });
    }

    const results: Awaited<ReturnType<typeof Taferie.rhopse>>[] = [];

    for (const [id_pg, id_produit, quantite, rhopsePourUnAncien] of lignesPg) {
      results.push(
        await Taferie.rhopse(
          {
            type: "pg_boq",
            from: id_pg,
            to: id_boquette,
            id_produit,
            quantite,
            rhopse_ancien: rhopsePourUnAncien,
            rhopseur: rhopseur_string,
          },
          true,
        ),
      );
    }

    for (const l of lignesFams) {
      results.push(
        await Taferie.rhopse({
          type: "fams_boq",
          from: new Fams(l.nums).ID,
          to: id_boquette,
          id_produit: l.id_produit,
          quantite: l.quantite,
          rhopseur: rhopseur_string,
        }),
      );
    }

    return { results };
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
