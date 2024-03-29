import { z } from "zod";
import type { PageServerLoad } from "../$types";
import { error } from "@sveltejs/kit";
import { LydiaManager } from "$lib/server/lydia";
import {LYDIA_VENDOR_KEY} from "$env/static/private";
import prisma from "$lib/prisma";
import { Taferie } from "$lib/server/classes/Taferie";

export const load:PageServerLoad  = async ({locals, parent})=>{
  if(!locals.session.data.user) throw error(400);
  const a = await prisma.rechargements.findFirst({where:{id_pg:locals.session.data.user.pg.id_pg, status:0}});

  return { verify: a != null, date:a?.date };
}

const lydiaDemandSchema  = z.object({
  tel:z.string(),
  montant:z.string(),
});

export const actions = {
  createLydiaDemand: async ({request, locals}) =>{
    const a = await request.formData()
    const data = lydiaDemandSchema.safeParse(Object.fromEntries(a));
    if(!data.success) throw error(400);
    const montant = parseFloat(data.data.montant);
    if(isNaN(montant) || montant <= 0 || locals.session.data.user == null) throw error(400);

    const r = await LydiaManager.createLydiaDemand(locals.session.data.user.pg.id_pg, {montant, numero:data.data.tel}, LYDIA_VENDOR_KEY)
    return r;
  },
  rechargementFams: async ({request, locals}) =>{
    const a = await request.formData()
    const montant = parseFloat(a.get('montant')?.toString()??'');
    const libelle = a.get('libelle')?.toString()??'';
    if(isNaN(montant) || montant <= 0 || locals.session.data.user == null) throw error(400);

    await Taferie.rhopse({
      type:'pg_fams', 
      from:locals.session.data.user.pg.nums,
      to:locals.session.data.user.fams.nums,
      montant,
      libelle
    });
  },
  verifyLydiaDemand: async({request, locals}) => {
    if(!locals.session.data.user) throw error(400);
    const a = await prisma.rechargements.findFirst({where:{id_pg:locals.session.data.user.pg.id_pg, status:0}});
    if(a == null) throw error(400);
    const r = await LydiaManager.verifyLydiaDemand(a.id_rechargement, LYDIA_VENDOR_KEY, a.keyLydia);
    return r;
  }
}