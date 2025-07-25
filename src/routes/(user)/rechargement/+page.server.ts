import type { PageServerLoad } from "../$types";
import { error, fail } from "@sveltejs/kit";
import { LydiaManager } from "$lib/server/lydia";
import { env } from "$env/dynamic/private";
import prisma from "$lib/prisma";
import { Taferie } from "$lib/server/classes/Taferie";
import {
  EnvoiBrouzoufsSchema,
  LydiaDemandFrontSchema,
  RechargementFamsSchema,
} from "$lib/zodSchema";

const {LYDIA_VENDOR_KEY} = env;

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.session.data.user) throw error(400);
  const a = await prisma.rechargements.findFirst({
    where: { id_pg: locals.session.data.user.pg.id_pg, status: 0 },
  });

  const lydiazocque = await prisma.config.findMany({
    where: { nom: "lydiazocque" },
  });

  return { paid_request: a, date: a?.date, lydiazocque: lydiazocque[0].valeur=='1' };
};

export const actions = {
  createLydiaDemand: async ({ request, locals }) => {
    if (!locals.session.data.user) throw error(400);

    const lydiazocque = await prisma.config.findMany({
      where: { nom: "lydiazocque" },
    });
    if (lydiazocque[0].valeur == "1") throw error(400);

    const a = await request.formData();
    const data = LydiaDemandFrontSchema.safeParse(Object.fromEntries(a));
    if (!data.success) return fail(400, { message: "An error occured" });
    const r = await LydiaManager.createLydiaDemand(
      locals.session.data.user.pg.id_pg,
      { montant: data.data.montant, numero: data.data.tel },
      LYDIA_VENDOR_KEY,
    );
    return r;
  },
  rechargementFams: async ({ request, locals }) => {
    if (!locals.session.data.user) throw error(400);

    const d = Object.fromEntries(await request.formData());
    const data = RechargementFamsSchema.safeParse(d);

    if (!data.success) return { success: false, message: "an error occured" };

    return await Taferie.rhopse({
      type: "pg_fams",
      from: locals.session.data.user.pg.id_pg,
      to: locals.session.data.user.fams.nums,
      montant: -data.data.montant,
      libelle: data.data.libelle,
    });
  },
  verifyLydiaDemand: async ({ locals }) => {
    if (!locals.session.data.user) return fail(400);
    const rechargement = await prisma.rechargements.findFirst({
      where: { id_pg: locals.session.data.user.pg.id_pg, status: 0 },
    });

    if (rechargement == null)
      return { message: "Contactez un administrateur" };
    const r = await LydiaManager.verifyLydiaDemand(
      rechargement.id_rechargement,
      LYDIA_VENDOR_KEY,
      rechargement.keylydia,
    );
    return r;
  },
  envoiBrousoufs: async ({ request, locals }) => {
    if (!locals.session.data.user) throw error(400);

    const d = Object.fromEntries(await request.formData());
    const data = EnvoiBrouzoufsSchema.safeParse(d);

    if (!data.success) return { success: false, message: "an error occured" };

    const pg = await prisma.pg.findFirst({
      where: { nums: data.data.nums, proms: data.data.proms },
    });
    if (pg == null) throw error(400);

    return await Taferie.rhopse({
      type: "pg_pg",
      from: locals.session.data.user.pg.id_pg,
      to: pg.id_pg,
      montant: -data.data.montant,
      libelle: data.data.libelle,
    });
  },
};
