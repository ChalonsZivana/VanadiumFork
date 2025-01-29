import type { PageServerLoad } from "./$types";
import { getTop, getTops } from "$lib/server/db_connection";
import prisma from "$lib/prisma";
import { error } from "@sveltejs/kit";
import {
  BOQUETTES_ALCOOL,
  BOQUETTES_NOURRITURES,
  BOQUETTES_TOPS,
} from "$lib/server/classes/Boquette";
import { StatisticsSchema } from "$lib/zodSchema";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session.data.user == null) throw error(400);
  const tops = getTops();
  const a = await prisma.consommations.groupBy({
    by: ["to"],
    where: {
      type: "pg_boq",
      from: locals.session.data.user.pg.id_pg,
      montant: { lt: 0 },
      to: { in: Object.values(BOQUETTES_TOPS) },
    },
    _sum: { montant: true },
  });
  const consos = a.map((e) => {
    return { id_boquette: e.to!, montant: Math.abs(e._sum.montant!) };
  });

  return {
    tops,
    boquettes: await prisma.boquettes.findMany({
      select: { id_boquette: true, nom: true },
    }),
    consos: consos,
    boquettes_nourritures: BOQUETTES_NOURRITURES,
    boquettes_alcool: BOQUETTES_ALCOOL,
    boquettes_tops: BOQUETTES_TOPS,
  };
};

export const actions = {
  stats: async ({ request }) => {
    const d = Object.fromEntries(await request.formData());
    const data = StatisticsSchema.safeParse(d);

    if (!data.success) throw error(400);
    if (!Object.values(BOQUETTES_TOPS).includes(data.data.id_boquette))
      throw error(400);

    return {
      top: await getTop("t", data.data.id_boquette, {
        jours: data.data.jours,
        take: data.data.take,
      }),
    };
  },
};
