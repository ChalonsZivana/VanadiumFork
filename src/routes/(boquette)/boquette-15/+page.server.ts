import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { error, fail } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
  const boquette = await prisma.boquettes.findFirst({
    where:{id_boquette:15}
  })

  if (!boquette) throw error(404);
  return {
    boquette,
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
