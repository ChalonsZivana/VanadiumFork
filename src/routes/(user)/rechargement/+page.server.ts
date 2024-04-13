import type { PageServerLoad } from "../$types";
import { error, fail } from "@sveltejs/kit";
import { LydiaManager } from "$lib/server/lydia";
import {LYDIA_VENDOR_KEY} from "$env/static/private";
import prisma from "$lib/prisma";
import { Taferie } from "$lib/server/classes/Taferie";
import { LydiaDemandFrontSchema } from "$lib/zodSchema";

export const load:PageServerLoad  = async ({locals})=>{
  if(!locals.session.data.user) throw error(400);
  const a = await prisma.rechargements.findFirst({where:{id_pg:locals.session.data.user.pg.id_pg, status:0}});

  const lydiazocque = await prisma.config.findMany({where:{nom:'lydiazocque'}});

  return { verify: a != null, date:a?.date, lydiazocque:lydiazocque[0] };
}



export const actions = {
  createLydiaDemand: async ({request, locals}) =>{
    if(locals.session.data.user == null) throw error(400);

    const lydiazocque = await prisma.config.findMany({where:{nom:'lydiazocque'}});
    if(lydiazocque[0].valeur == '1') throw error(400);

    const a = await request.formData()
    const data = LydiaDemandFrontSchema.safeParse(Object.fromEntries(a));
    if(!data.success) return fail(400, {message:'An error occured'});
    const r = await LydiaManager.createLydiaDemand(
      locals.session.data.user.pg.id_pg, {montant:data.data.montant, numero:data.data.tel}, LYDIA_VENDOR_KEY
    );
    return r;
  },
  rechargementFams: async ({request, locals}) =>{
    const a = await request.formData()
    const montant = parseFloat(a.get('montant')?.toString()??'');
    const libelle = a.get('libelle')?.toString()??'';
    if(isNaN(montant) || montant <= 0 || locals.session.data.user == null) throw error(400);
    
    
    return await Taferie.rhopse({
      type:'pg_fams', 
      from:locals.session.data.user.pg.id_pg,
      to:locals.session.data.user.fams.nums,
      montant: -montant,
      libelle
    });
  },
  verifyLydiaDemand: async({locals}) => {
    if(!locals.session.data.user) throw error(400);
    const a = await prisma.rechargements.findFirst({where:{id_pg:locals.session.data.user.pg.id_pg, status:0}});
    if(a == null) throw error(400);
    const r = await LydiaManager.verifyLydiaDemand(a.id_rechargement, LYDIA_VENDOR_KEY, a.keyLydia);
    return r;
  }
}