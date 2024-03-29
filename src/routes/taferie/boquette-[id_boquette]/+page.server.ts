import { consommations, consommationsSchema } from '$lib/components/search/fullsearch.js';
import prisma from '$lib/prisma.js';
import { hashPassword } from '$lib/server/auth.js';
import { Taferie } from '$lib/server/classes/Taferie';
import { Prisma, consommations_type } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';
import { z } from 'zod';

export async function load({params}){
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);
  const boquette =await prisma.boquettes.findFirst({where:{id_boquette}});
  if(boquette == null) throw error(404);
  const consommations = await prisma.consommations.findMany({
    where:{OR:[
      {type:"pg_boq", to:id_boquette},
      {type:'boq_ext', from:id_boquette}
    ]},
    take:100,
    orderBy:{date_conso:'desc'}
  });
  
  return {
    totalCons:await prisma.consommations.count(),
    boquette,
    consommations
  }
}


export let actions = {
  consommations:  async ({ request, params }) => {
    const d = Object.fromEntries(await request.formData());
    const data = consommationsSchema.safeParse(d);
    if(!data.success) throw error(400);

    if([null, 'pg_boq', 'boq_ext'].includes(data.data.consoType)){
      return consommations(data.data.consoType as consommations_type | null, data.data);
    }
    throw error(400);
  },
  "editBoquette":async({request, params})=>{
    const id_boquette = parseInt(params.id_boquette);
    if(isNaN(id_boquette)) throw error(404);
    const data = Object.fromEntries(await request.formData());
    const d = EditBoquetteSchema.safeParse(data);
    if(!d.success) return {success:false};

    if(d.data['Nouveau mot de passe'] != d.data['Confirmation nouveau mot de passe']) return {different_passwords:true}
    const createData:Prisma.boquettesUpdateInput = {
      nom:d.data.Nom,
      nom_simple:d.data.Identifiant,
      partie_pg:d.data['Partie PG'] == 'on' ? true:false
    }
    if(d.data['Nouveau mot de passe']!=""){
      createData.mot_de_passe = hashPassword(d.data['Nouveau mot de passe'])
    }

    await prisma.boquettes.update({
      where:{id_boquette},
      data:createData
    })
  },
  cancel:async({request})=>{
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString()??'');
    if(isNaN(id)) return fail(400, {});

    await Taferie.cancelConsommation(id, true);
  },
  uncancel:async({request})=>{
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString()??'');
    if(isNaN(id)) return fail(400, {});

    await Taferie.cancelConsommation(id, false);
  }
}

const EditBoquetteSchema  = z.object({
  Nom:z.string(),
  Identifiant:z.string(),
  "Nouveau mot de passe":z.string(),
  "Confirmation nouveau mot de passe":z.string(),
  "Partie PG": z.union([z.literal('on'), z.undefined()])
})
