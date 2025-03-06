import { consommationsSearch } from "$lib/components/search/consommations/fullsearch";
import prisma from "$lib/prisma";
import { Boquette } from "$lib/server/classes/Boquette.js";
import { Taferie } from "$lib/server/classes/Taferie.js";
import { AjouterMembreSchema, ConsommationsSchema } from "$lib/zodSchema.js";
import { consommations_type } from "@prisma/client";
import { error, fail } from "@sveltejs/kit";

export async function load({ params, url }) {
  const id_boquette = parseInt(params.id_boquette);
  if (isNaN(id_boquette)) throw error(404);

  const queryParams = Object.fromEntries(url.searchParams.entries());

  const boquette = await prisma.boquettes.findFirst({ 
    where: { id_boquette }, 
    include:{zident:true} 
  });
  if (boquette == null) throw error(404);

  const data = ConsommationsSchema.safeParse(queryParams);
  if (!data.success) throw error(400);

  if (!["Tout", "pg_boq", "ext_boq"].includes(data.data.consoType))
    throw error(400);
  const consoType = data.data.consoType as consommations_type | "Tout";

  return {
    boquette,
    produits: await prisma.produits.findMany({ where: { id_boquette } }),
    categories: await prisma.categories.findMany({ where: { id_boquette } }),
    search: await consommationsSearch(
      consoType == "Tout"
        ? [
            { type: "ext_boq", to: id_boquette },
            { type: "pg_boq", to: id_boquette },
          ]
        : [{ type: consoType, to: id_boquette }],
      data.data,
    ),
  };
}

export let actions = {
  transfert: async ({ request, params }) => {
    const data = await request.formData();
    const montant = parseFloat(data.get("montant")?.toString() ?? "");
    const libelle = data.get("libelle")?.toString() ?? "";
    const id_boquette = parseInt(params.id_boquette);
    if (isNaN(montant) || isNaN(id_boquette)) throw error(400);

    await Taferie.rhopse({
      type: "ext_boq",
      to: id_boquette,
      montant: -montant,
      libelle,
    });
  },
  changer_zident: async ({ request, params }) => {
    const id_boquette = parseInt(params.id_boquette);
    if (isNaN(id_boquette)) return fail(400);

    const d = Object.fromEntries(await request.formData());
    const data = AjouterMembreSchema.safeParse(d);
    if (!data.success) throw error(400);

    const pg = await prisma.pg.findFirst({
      where: { nums:data.data.nums, proms:data.data.proms }
      }
    )
    if(!pg) return fail(400);

    await prisma.boquettes.update({
      where:{id_boquette},
      data:{id_zident:pg.id_pg}
    });

    const appartenance = await prisma.appartenance_boquettes.findMany({
      where:{id_boquette,id_pg:pg.id_pg},
    })
    if(appartenance.length == 0){
      await prisma.appartenance_boquettes.create({
        data:{id_boquette,id_pg:pg.id_pg},
      })
    }
  },
};
