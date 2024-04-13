import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { getTopNegats } from "$lib/server/db_connection";
import { Database } from "$lib/server/classes/Database";


const currentProms = [221,222,223]


export const load:PageServerLoad = async ()=>{
  return {
    topNegats:getTopNegats(null),
    fondsProms: await Database.fondsProms(currentProms),
    negatsProms: await Database.negatsProms(currentProms),
    boquettes:prisma.boquettes.findMany({select:{nom:true,nom_simple:true,id_boquette:true, solde:true}}),
    pgs:prisma.pg.findMany({select:{bucque:true, nums:true, proms:true, id_pg:true, solde:true},orderBy:{proms:'desc'}}),
    fams:prisma.fams.findMany(),
  };
}

export const actions = {
  lydiazocque:async({request})=>{
    const data = await request.formData();
    const bool = (data.get('lydiazocque') ?? '') == 'on' ? '1':'0';
    
    await prisma.config.updateMany({where:{nom:'lydiazocque'}, data:{valeur:bool}})
  },
  vanazocque:async({request})=>{
    const data = await request.formData();
    const bool = (data.get('vanazocque') ?? '') == 'on' ? '1':'0';

    await prisma.config.updateMany({where:{nom:'vanazocque'}, data:{valeur:bool}})
  }
}