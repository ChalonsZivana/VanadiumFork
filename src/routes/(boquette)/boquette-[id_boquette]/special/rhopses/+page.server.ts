import prisma from "$lib/prisma";
import { Boquette } from "$lib/server/classes/Boquette";
import { Database } from "$lib/server/classes/Database";
import { Taferie } from "$lib/server/classes/Taferie";
import { RhopseSchema } from "$lib/zodSchema";
import { error, fail } from "@sveltejs/kit";

export const load = async ({ params }) => {
  const id_boquette = parseInt(params.id_boquette);
  if (isNaN(id_boquette)) throw error(404);

  return {
    categories: await prisma.categories.findMany({
      where: { id_boquette },
      orderBy: { nom: "asc" },
    }),
    products: await prisma.produits.findMany({
      where: { id_boquette },
      orderBy: { nom: "asc" },
    }),
    id_boquette,
    proms: {
      222: await Database.getNumsInProms(222),
      223: await Database.getNumsInProms(223),
      224: await Database.getNumsInProms(224),
    },
  };
};

export const actions = {
  rhopse: async ({ request, params, locals }) => {
    const id_boquette = parseInt(params.id_boquette);
    const id_pg = 2625; //parseInt(params.id_pg);
    const rhopseur = locals.session.data.user;

    if (!id_boquette || !id_pg || !rhopseur) throw error(400);
    const rhopseur_string = `${rhopseur.pg.nums}ch${rhopseur.pg.proms}`;

    const t = Object.fromEntries(await request.formData());
    const parse = RhopseSchema.safeParse(t);

    if (!parse.success) return fail(400, {});
    const data = parse.data;

    if (!Boquette.exists(id_boquette)) return fail(400, {});

    const boq = new Boquette(id_boquette);

    const results: Awaited<ReturnType<typeof Taferie.rhopse>>[] = [];
    for (let [id_produit, quantite] of data.produits) {
      const r = await Taferie.rhopse({
        type: "pg_boq",
        from: id_pg,
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
