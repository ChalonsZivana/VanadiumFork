import type { PageServerLoad } from "./$types";
import { createUser } from "$lib/server/auth";
import { error } from "@sveltejs/kit";
import prisma from "$lib/prisma";

export const load:PageServerLoad = async ({params, url})=>{
  const id_pg = parseInt(params.id_pg);
  const user = await createUser(id_pg);
  if(user == null)throw error(404, 'User missing');

  const consommations = await prisma.consommations.findMany({where:{id_pg:id_pg}, orderBy:{date_conso:'desc'}});
  return {
   user, consommations
  };
}