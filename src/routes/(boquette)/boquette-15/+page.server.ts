import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load:PageServerLoad = async ()=>{  
  return {
    discale: await prisma.spotify.findMany({orderBy:{id:'desc'}})
  };
}