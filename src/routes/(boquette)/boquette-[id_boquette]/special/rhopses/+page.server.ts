import prisma from "$lib/prisma";
import { Database } from "$lib/server/classes/Database";
import { error } from "@sveltejs/kit";

export const load = async ({params})=>{
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);
  
  return { 
    categories:await prisma.categories.findMany({where:{id_boquette}, orderBy:{nom:'asc'}}),
    products:await prisma.produits.findMany({where:{id_boquette}, orderBy:{nom:'asc'}}),
    id_boquette,
    proms:{
      222:await Database.getNumsInProms(222),
      223:await Database.getNumsInProms(223),
      224:await Database.getNumsInProms(224),
    }
  };
}