import prisma from "$lib/prisma";
import { Boquette } from "$lib/server/classes/Boquette";
import { Database } from "$lib/server/classes/Database";
import { fail } from "@sveltejs/kit";

export const load = async ()=>{
  //7:foys  147:koenettrie
  const id_boquette = 7;
  
  return { 
    categories:await prisma.categories.findMany({where:{id_boquette}, orderBy:{nom:'asc'}}),
    products:await prisma.produits.findMany({where:{id_boquette}, orderBy:{nom:'asc'}}),
    id_boquette,
    proms:{
      221:await Database.getNumsInProms(221),
      222:await Database.getNumsInProms(222),
      223:await Database.getNumsInProms(223),
    }
  };
}