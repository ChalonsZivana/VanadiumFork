import prisma from "$lib/prisma";
import { RhopseSchemaFignos } from "$lib/zodSchema.js";
import { error, fail } from "@sveltejs/kit";
import Twilio from "twilio";

const accountSid = "AC926d01b1dace4d670f34b2a617cf32d1";
const authToken = "92869824d3229f990e7da757f855da21";
const client = new Twilio(accountSid, authToken);

export async function load({ params }) {
  const numero_table = parseInt(params.numero_table);
  if (isNaN(numero_table)) throw error(404);

  // Récupération des deux catégories
  const categories = await prisma.categories.findMany({
    where: { id_boquette: 223, id_categorie: { in: [132, 169] } },
    orderBy: { nom: "asc" },
  });

  const produits = await prisma.produits.findMany({
    where: { id_boquette: 223 },
    orderBy: { nom: "asc" },
  });

  return {
    produits,
    categories,
    numero_table,
  };
}

export const actions = {
  commande: async ({ request, params }) => {
    const numero_table = parseInt(params.numero_table);
    if (isNaN(numero_table)) throw error(404);

    const t = Object.fromEntries(await request.formData());
    const parse = RhopseSchemaFignos.safeParse(t);

    if (!parse.success) return fail(400, {});
    const data = parse.data;

    const produits = await Promise.all(
      data.produits.map(async (e) => {
        return {
          prod: await prisma.produits.findFirst({
            where: { id_produit: e[0] },
          }),
          q: e[1],
        };
      }),
    );

    if (!produits.every((e) => e !== null)) return { success: false };

    for (let prod of produits) {
      await prisma.commandes.create({
        data: {
          type: "ext_boq",
          from: numero_table,
          to: 223,
          libelle: `Table ${numero_table}:${prod.prod?.nom} ${prod.q} - Paiement ${data.mode_paiement}`,
        },
      });
    }

    return { success: true };
  },
};
