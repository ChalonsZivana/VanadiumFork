import prisma from '$lib/prisma.js';
import { BOQUETTES } from '$lib/server/classes/Boquette.js';
import { error } from '@sveltejs/kit';

export const load = async ({params})=>{
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);

  let categories = await prisma.categories.findMany({where:{id_boquette:id_boquette}, orderBy:{nom:'asc'}});
  let produits = await prisma.produits.findMany({where:{id_boquette:id_boquette}, orderBy:{nom:'asc'}});

  if(id_boquette == BOQUETTES["Foy's"]){
    const produits_2 = await prisma.produits.findMany({where:{id_boquette:BOQUETTES['Satan']}, orderBy:{nom:'asc'}});
    produits = [...produits, ...produits_2];

    const categories_2 = await prisma.categories.findMany({where:{id_boquette:BOQUETTES['Satan']}, orderBy:{nom:'asc'}});
    categories = [...categories, ...categories_2];
  }
  
  return { 
    produits,categories, id_boquette 
  };
}