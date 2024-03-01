import type { PageServerLoad } from "./$types";
import { getTops } from '$lib/server/db_connection'
import prisma from "$lib/prisma";


export const load:PageServerLoad = async ({locals})=>{
  const tops = getTops();
  const a = await prisma.consommations.groupBy(
    {
      by:['id_boquette'],
      where:{id_pg:locals.session.data.user.pg.id_pg},
      _sum:{ debit:true }
    }
  )
  const consos = a.map(e=>{return{"id_boquette":e.id_boquette,"debit":e._sum.debit}});

  return {
    tops:await tops,
    boquettes:await prisma.boquettes.findMany({select:{id_boquette:true, nom:true}}),
    consos:consos
  };
}

