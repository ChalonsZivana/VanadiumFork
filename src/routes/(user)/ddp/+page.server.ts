import { consommationsSearch } from '$lib/components/search/consommations/fullsearch';
import prisma from '$lib/prisma.js';
import { Database } from '$lib/server/classes/Database.js';
import { ConsommationsSchema } from '$lib/zodSchema.js';
import { consommations_type } from '@prisma/client';
import { error } from '@sveltejs/kit';

export async function load({locals, url}){
  const user = locals.session.data.user;
  if(user == null) throw error(404);

  const proms = user.pg.proms;

  const queryParams = Object.fromEntries(url.searchParams.entries());

  const data = ConsommationsSchema.safeParse(queryParams);

  if(!data.success) throw error(400);
  const consoType = data.data.consoType as consommations_type | 'Tout';

  return {
    pgs:await prisma.pg.findMany({where:{proms}, select:{nums:true, proms:true, bucque:true, solde:true,email:true}, orderBy:{nums:'asc'}}),
    proms,
    negats:await Database.negatsProms([user.pg.proms]),
    search:await consommationsSearch(
      consoType == 'Tout' ? []: [{type:consoType}], 
      data.data
    )
  }
}


export let actions = {
  consommations:  async ({ request, locals }) => {
    const user = locals.session.data.user;
    if(user == null) throw error(404);

    const d = Object.fromEntries(await request.formData());
    const data = ConsommationsSchema.safeParse(d);

    if(!data.success || data.data.proms != user.pg.proms) throw error(400);

    if(data.data.consoType != 'Tout' && !(data.data.consoType in consommations_type)) throw error(400);
    const consoType = data.data.consoType as consommations_type | 'Tout';

    return {
      search:await consommationsSearch(
        consoType == 'Tout' ? null : [{type:consoType}], data.data
      )
    }
  },
}