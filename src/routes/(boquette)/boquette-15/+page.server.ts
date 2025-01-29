import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
  return {
    id_boquette: 15,
    discale: await prisma.spotify.findMany({ orderBy: { id: "desc" } }),
  };
};

export const actions = {
  delete: async ({ request }) => {
    const d = await request.formData();
    const id = parseInt(d.get("id")?.toString() ?? "");
    if (isNaN(id)) return fail(400);

    await prisma.spotify.delete({ where: { id } }).catch((_) => {});
  },
};
