import prisma from "$lib/prisma";
import { Boquette } from "$lib/server/classes/Boquette";
import { Database } from "$lib/server/classes/Database";
import { Taferie } from "$lib/server/classes/Taferie";
import { RhopseSchema } from "$lib/zodSchema";
import { error, fail } from "@sveltejs/kit";
import { Fams } from "$lib/server/classes/Fams";
import { z } from "zod";

export const load = async ({ params, locals }) => {
  const id_boquette = parseInt(params.id_boquette);
  if (isNaN(id_boquette)) throw error(404);
  const boquette = await prisma.boquettes.findFirst({ where: { id_boquette } });
  if (!boquette) throw error(404);

  const idPgUser = locals.session.data.user?.pg.id_pg;
  const isAdmin = idPgUser != null && (await Taferie.isTaferie(idPgUser));
  const famsBloque = !isAdmin && (await Taferie.famsZocque());

  return {
    famsBloque,
    categories: await prisma.categories.findMany({
      where: { id_boquette },
      orderBy: { nom: "asc" },
    }),
    products: await prisma.produits.findMany({
      where: { id_boquette },
      orderBy: { nom: "asc" },
    }),
    boquette,
    proms: {
      223: await Database.getNumsInProms(223), //Numéros à changer pour pouvoir rhopser les prom's au Tabagn's
      224: await Database.getNumsInProms(224),
      225: await Database.getNumsInProms(225),
    },
  };
};

export const actions = {
  rhopse: async ({ request, params, locals }) => {
    const id_boquette = parseInt(params.id_boquette);
    const rhopseur = locals.session.data.user;

    if (!id_boquette || !rhopseur) throw error(400);
    const rhopseur_string = `${rhopseur.pg.nums}ch${rhopseur.pg.proms}`;

    const t = Object.fromEntries(await request.formData());
    const idsSchema = z.object({
      id_pg: z.string().optional(),
      id_fams: z.string().optional(),
    });
    const newSchema = RhopseSchema.merge(idsSchema)
      .transform((e) => ({
        id_pg: e.id_pg ? parseInt(e.id_pg) : null,
        id_fams: e.id_fams ? parseInt(e.id_fams) : null,
        produits: e.produits,
        rhopse_ancien: e.rhopse_ancien,
      }))
      .refine(
        (e) =>
          // exactement un des deux, valide
          (e.id_pg != null) != (e.id_fams != null) &&
          !Number.isNaN(e.id_pg ?? e.id_fams) &&
          (e.id_fams == null || (e.id_fams >= 1 && e.id_fams <= 50)),
        { message: "id_pg or id_fams invalid" },
      );

    const parse = newSchema.safeParse(t);
    if (!parse.success) return fail(400, {});
    const data = parse.data;

    if (
      data.id_fams != null &&
      !(await Taferie.isTaferie(rhopseur.pg.id_pg)) &&
      (await Taferie.famsZocque())
    )
      return fail(403, {
        success: false,
        message: "Les rhopses sur les fam's sont désactivées",
      });

    if (!(await Boquette.exists(id_boquette))) return fail(400, {});
    const boq = new Boquette(id_boquette);

    const results: Awaited<ReturnType<typeof Taferie.rhopse>>[] = [];
    for (let [id_produit, quantite] of data.produits) {
      const r =
        data.id_fams != null
          ? await Taferie.rhopse({
              type: "fams_boq",
              from: new Fams(data.id_fams).ID, // normalise (ex: 9 -> 8)
              to: boq.ID,
              id_produit,
              quantite,
              rhopseur: rhopseur_string,
            })
          : await Taferie.rhopse({
              type: "pg_boq",
              from: data.id_pg!,
              to: boq.ID,
              id_produit,
              quantite,
              rhopse_ancien: data.rhopse_ancien ?? null,
              rhopseur: rhopseur_string,
            });
      results.push(r);
    }
    return results;
  },
};
