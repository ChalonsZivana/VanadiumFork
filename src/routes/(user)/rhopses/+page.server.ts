import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { BOQUETTES_LIBRE_SERVICE } from "$lib/server/classes/Boquette";

export const load: PageServerLoad = async () => {
  //7:foys  147:koenettrie
  const boquettes = await prisma.boquettes.findMany({
    select: { id_boquette: true, nom: true, nom_simple: true },
    where: { id_boquette: { in: Object.values(BOQUETTES_LIBRE_SERVICE) } },
  });

  return { boquettes };
};
