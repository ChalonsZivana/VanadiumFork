import { createUser, hashPassword } from "$lib/server/auth";
import { error, fail, redirect } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { Taferie } from "$lib/server/classes/Taferie";
import { Pg } from "$lib/server/classes/PG";
import { EditPgSchema } from "$lib/zodSchema.js";
import { Fams } from "$lib/server/classes/Fams.js";

export const load = async ({ params }) => {
  const id_pg = parseInt(params.id_pg);
  const user = await createUser(id_pg);
  if (user == null) throw error(404, "User missing");

  const consommations = Taferie.consommations([
    { type: "pg_boq", from: id_pg },
    { type: "pg_pg", from: id_pg },
    { type: "pg_fams", from: id_pg },
    { type: "pg_ext", from: id_pg },
  ]);
  return {
    user,
    consommations,
  };
};

export const actions = {
  transfert: async ({ request, params }) => {
    const data = await request.formData();
    const montant = parseFloat(data.get("montant")?.toString() ?? "");
    const libelle = data.get("libelle")?.toString() ?? "";
    const id_pg = parseInt(params.id_pg);
    if (isNaN(montant) || isNaN(id_pg) || !Pg.exists(id_pg)) throw error(400);

    return await Taferie.rhopse({
      type: "pg_ext",
      from: id_pg,
      montant: montant,
      libelle,
    });
  },
  cancel: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString() ?? "");
    if (isNaN(id)) return fail(400, {});

    await Taferie.cancelConsommation(id, true);
  },
  uncancel: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString() ?? "");
    if (isNaN(id)) return fail(400, {});

    await Taferie.cancelConsommation(id, false);
  },
  fonds_ffams: async ({ params }) => {
    const id_pg = parseInt(params.id_pg);
    if (isNaN(id_pg)) throw error(400);

    const pg = await new Pg(id_pg).pg();
    const fams = new Fams(pg.nums);
    if (pg == null) throw error(400);

    const r = await Taferie.rhopse({
      type: "pg_fams",
      from: id_pg,
      to: fams.ID,
      montant: -pg.solde,
      libelle: "Fonds vers Fonds Fams",
    });
    if (r?.success) {
      return { success: true, message: "Fonds transférés" };
    } else {
      return r;
    }
  },
  delete: async ({ params }) => {
    const id_pg = parseInt(params.id_pg);
    if (isNaN(id_pg)) throw error(400);
    const pg = await new Pg(id_pg).pg();
    if (pg.solde != 0) return { wrong: "Le solde doit être nul" };

    await Taferie.deletePG(id_pg);

    throw redirect(300, "/taferie");
  },
  editPg: async ({ request, params }) => {
    const id_pg = parseInt(params.id_pg);
    if (!id_pg) throw error(400);
    const d = Object.fromEntries(await request.formData());
    const data = EditPgSchema.safeParse(d);

    if (!data.success)
      return fail(400, { success: false, message: "Something went wrong" });

    new Pg(id_pg).editPg(data.data);
  },
  change_password: async ({ params }) => {
    const id_pg = parseInt(params.id_pg);
    const mot_de_passe = Math.round(Math.random() * 100_000).toString();
    await prisma.pg.update({
      where: { id_pg },
      data: { mot_de_passe: hashPassword(mot_de_passe) },
    });

    return { success: true, message: "Mot de passe modifié: " + mot_de_passe };
  },
};
