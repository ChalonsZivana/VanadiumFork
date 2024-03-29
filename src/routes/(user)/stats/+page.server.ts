import type { PageServerLoad } from "./$types";
import { getTops } from '$lib/server/db_connection'
import prisma from "$lib/prisma";
import { error } from "@sveltejs/kit";


export const load:PageServerLoad = async ({locals})=>{
  if(locals.session.data.user == null) throw error(400);
  const tops = getTops();
  const a = await prisma.consommations.groupBy(
    {
      by:['to'],
      where:{type:"pg_boq",from:locals.session.data.user.pg.id_pg},
      _sum:{ montant:true }
    }
  )
  const consos = a.map(e=>{return{id_boquette:e.to, montant:e._sum.montant}});

  return {
    tops,
    boquettes:await prisma.boquettes.findMany({select:{id_boquette:true, nom:true}}),
    consos:consos
  };
}

