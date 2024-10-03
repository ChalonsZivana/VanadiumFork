import prisma from '$lib/prisma.js';
import { error, json } from '@sveltejs/kit';

export async function  POST({url, params}) {
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);

  const commandes = await prisma.commandes.findMany({where:{type:{in:['ext_boq','pg_boq'],},statut:-1, to:id_boquette}, orderBy:{'date':'desc'}});

  
  return json({
    commandes
  });
}

