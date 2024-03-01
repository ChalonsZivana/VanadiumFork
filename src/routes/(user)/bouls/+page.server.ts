import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";


export const load:PageServerLoad = async ()=>{
  const bouls = await prisma.bouls.findMany()
  return {
    bouls:bouls,
    bouls_users:await prisma.pg.findMany({
      select:{id_pg:true, bucque:true, proms:true, nums:true}, 
      where:{id_pg:{in:bouls.map((e)=>e.id_pg)}}
    }),
  };
}