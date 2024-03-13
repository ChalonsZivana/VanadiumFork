import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { getTopNegats } from "$lib/server/db_connection";
import { Database } from "$lib/server/classes/Database";


const currentProms = [221,222,223]


export const load:PageServerLoad = async ({locals})=>{
  return {
    topNegats:await getTopNegats(null),
    fondsProms: await Database.fondsProms(currentProms),
    negatsProms: await Database.negatsProms(currentProms),
    boquettes:await prisma.boquettes.findMany({select:{nom:true,nom_simple:true,id_boquette:true, solde:true}}),
    pgs:await prisma.pg.findMany({select:{bucque:true, nums:true, proms:true, id_pg:true, solde:true},orderBy:{proms:'desc'}}),
    fams:await prisma.fams.findMany()
  };
}