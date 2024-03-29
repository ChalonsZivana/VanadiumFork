import prisma from '$lib/prisma.js';
import { Taferie } from '$lib/server/classes/Taferie.js';
import { error } from '@sveltejs/kit';

export const load = async ({params})=>{
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);
  
  const pgs = prisma.pg.findMany({
    where:{proms:{gte:221}}, 
    select:{nums:true,proms:true, bucque:true, id_pg:true}
  })
  return { 
    pgs,
    consommations: await Taferie.consommations('boq', id_boquette),    
    totalCons:await prisma.consommations.count()  
  };
}