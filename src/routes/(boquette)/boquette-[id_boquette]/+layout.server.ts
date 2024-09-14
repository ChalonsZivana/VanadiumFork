import prisma from '$lib/prisma.js';
import { error } from '@sveltejs/kit';

export const load = async ({params})=>{
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);

  let categories = await prisma.categories.findMany({where:{id_boquette:id_boquette}, orderBy:{nom:'asc'}});
  let produits = await prisma.produits.findMany({where:{id_boquette:id_boquette}, orderBy:{nom:'asc'}});
  
  return { 
    produits,categories, id_boquette 
  };
}