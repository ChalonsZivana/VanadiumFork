import prisma from '$lib/prisma.js';
import { BOQUETTES } from '$lib/server/classes/Boquette.js';
import { error, json } from '@sveltejs/kit';

export async function GET({locals}) {
  if(locals.session.data.boquettes.find(e => e.id_boquette==BOQUETTES["Ser'C"]) === undefined) throw error(400);

  const exportOnscrits = await prisma.suivi_onscrits.findMany({orderBy:{nums:'asc'}, select:{nums:true, comments:true}});

  return json(exportOnscrits);
}