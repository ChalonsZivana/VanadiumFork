import prisma from "$lib/prisma.js";
import { error, fail, json } from "@sveltejs/kit";
import { z } from "zod";

export async function POST({ url, params, request }) {
  const id_boquette = parseInt(params.id_boquette);
  if (isNaN(id_boquette)) throw error(404);
  const a = await request.json();
  const data = z.array(z.number()).safeParse(a["ids"]);
  if (!data.success) throw fail(400);
  const commandes = await prisma.commandes.findMany({
    where: {
      type: { in: ["ext_boq", "pg_boq"] },
      id: { notIn: data.data },
      statut: -1,
      to: id_boquette,
    },
    orderBy: { date: "desc" },
  });

  return json({
    commandes,
  });
}
