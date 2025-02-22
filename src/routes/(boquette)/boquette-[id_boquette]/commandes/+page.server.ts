import prisma from "$lib/prisma";
import { error, fail } from "@sveltejs/kit";

export async function load({ params }) {
  const id_boquette = parseInt(params.id_boquette);
  if (isNaN(id_boquette)) throw error(404);

  const commandesNonTraitees = await prisma.commandes.findMany({
    where: { type: { in: ["ext_boq", "pg_boq"] }, statut: -1, to: id_boquette },
    orderBy: { date: "desc" },
    include: { from_pg: { select: { nums: true, proms:true } } },
  });
  const commandesEnCours = await prisma.commandes.findMany({
    where: { type: { in: ["ext_boq", "pg_boq"] }, statut: 0, to: id_boquette },
    orderBy: { date: "desc" },
    include: { from_pg: { select: { nums: true, proms:true } } },
  });
  const commandesFinies = await prisma.commandes.findMany({
    where: { type: { in: ["ext_boq", "pg_boq"] }, statut: 1, to: id_boquette },
    orderBy: { date: "desc" },
    include: { from_pg: { select: { nums: true, proms:true } } },
  });
  return {
    commandesNonTraitees,
    commandesEnCours,
    commandesFinies,
  };
}

export const actions = {
  setStatus_1: async ({ params, request }) => {
    const id_boquette = parseInt(params.id_boquette);
    if (isNaN(id_boquette)) return fail(404);

    const formData = await request.formData();
    const id = parseInt(formData.get("id")?.toString() ?? "");
    if (isNaN(id)) return fail(400);

    return await prisma.commandes.update({
      where: { id, to: id_boquette, type: { in: ["ext_boq", "pg_boq"] } },
      data: { statut: -1 },
      include: { from_pg: { select: { nums: true, proms:true } } },
    });
  },
  setStatus0: async ({ params, request }) => {
    const id_boquette = parseInt(params.id_boquette);
    if (isNaN(id_boquette)) return fail(404);

    const formData = await request.formData();
    const id = parseInt(formData.get("id")?.toString() ?? "");
    if (isNaN(id)) return fail(400);

    return await prisma.commandes.update({
      where: { id, to: id_boquette, type: { in: ["ext_boq", "pg_boq"] } },
      data: { statut: 0 },
      include: { from_pg: { select: { nums: true, proms:true } } },
    });
  },
  setStatus1: async ({ params, request }) => {
    const id_boquette = parseInt(params.id_boquette);
    if (isNaN(id_boquette)) return fail(404);

    const formData = await request.formData();
    const id = parseInt(formData.get("id")?.toString() ?? "");
    if (isNaN(id)) return fail(400);

    return await prisma.commandes.update({
      where: { id, to: id_boquette, type: { in: ["ext_boq", "pg_boq"] } },
      data: { statut: 1 },
      include: { from_pg: { select: { nums: true, proms:true } } },
    });
  },
};
