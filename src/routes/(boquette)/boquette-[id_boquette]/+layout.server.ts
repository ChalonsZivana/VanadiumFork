import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types.js";
import prisma from "$lib/prisma.js";


export const load:LayoutServerLoad = async ({locals, params})=>{
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);


  const categories = await prisma.categories.findMany({where:{id_boquette:id_boquette}, orderBy:{nom:'asc'}});
  const produits = await prisma.produits.findMany({where:{id_boquette:id_boquette}, orderBy:{nom:'asc'}});
 
  return { 
    produits,categories, 
    USER:locals.session.data.user, 
    BOQUETTES:locals.session.data.boquettes, id_boquette 
  };
}