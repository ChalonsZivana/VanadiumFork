
import { error, fail } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";
import { Taferie } from "$lib/server/classes/Taferie";
import { Boquette } from "$lib/server/classes/Boquette";

export const load:PageServerLoad = async ({params, url})=>{
  const nums = parseInt(params.nums);
  if(isNaN(nums))throw error(404, 'Fams missing');
  const fams = await prisma.fams.findFirst({where:{nums}})
  if(fams == null)throw error(404, 'Fams missing');

  const historique_fams = await prisma.consommations.findMany({where:{type:{in:['ext_fams', 'pg_fams']},to:nums}, orderBy:{date_conso:'desc'}});
  return {
   fams, historique_fams
  };
}

export const actions = {
  "transfert":async ({request, params})=>{
    const data = await request.formData();
    const montant = parseFloat(data.get("montant")?.toString()??'');
    const libelle = data.get('libelle')?.toString() ?? '';
    const fams = parseInt(params.nums);
    if(isNaN(montant) || isNaN(fams)) throw error(400);

    await Taferie.rhopse({type:"ext_fams", to:fams, montant:-montant, libelle});
  },
  "cancel":async({request})=>{
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString()??'');
    if(isNaN(id)) return fail(400, {});

    await Taferie.cancelConsommation(id, true);
  },
  "uncancel":async({request})=>{
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString()??'');
    if(isNaN(id)) return fail(400, {});

    await Taferie.cancelConsommation(id, false);
  }
}