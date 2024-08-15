import { consommationsSearch } from '$lib/components/search/consommations/fullsearch';
import prisma from '$lib/prisma.js';
import { Boquette } from '$lib/server/classes/Boquette.js';
import { ConsommationsSchema } from '$lib/zodSchema.js';
import type { consommations_type } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';

export const load = async ({params})=>{
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);
  
  const pgs = prisma.pg.findMany({
    where:{proms:{gte:221}}, 
    select:{nums:true,proms:true, bucque:true, id_pg:true}
  })
  return { 
    pgs,
    search:await consommationsSearch(
      [{type:'ext_boq', to:id_boquette},{type:'pg_boq', to:id_boquette}], 
      { consoType:'',consoYear:NaN,sortDir:'desc',sortType:'date',nums:NaN,proms:NaN, page:1}
    )
  };
}


export const actions = {
  consommations:  async ({ request,params }) => {
    const id_boquette = parseInt(params.id_boquette);
    if(!id_boquette) throw error(400);
    const d = Object.fromEntries(await request.formData());
    const data = ConsommationsSchema.safeParse(d);
    if(!data.success) throw error(400);

    if(!['Tout', 'pg_boq', 'ext_boq'].includes(data.data.consoType)) throw error(400);
    const consoType = data.data.consoType as consommations_type | 'Tout';

    return {
      search:await consommationsSearch(
        consoType == 'Tout' ? [{type:'ext_boq', to:id_boquette},{type:'pg_boq', to:id_boquette}]: [{type:consoType, to:id_boquette}], 
        data.data
      )
    }
  },
  cancel:async({request, params})=>{
    const id_boquette = parseInt(params.id_boquette);
    if(isNaN(id_boquette)) throw error(400);
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString()??'');
    if(isNaN(id)) return fail(400, {});

    await new Boquette(id_boquette).cancelConsommation(id, true);
  },
  uncancel:async({request, params})=>{
    const id_boquette = parseInt(params.id_boquette);
    if(isNaN(id_boquette)) throw error(400);
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString()??'');
    if(isNaN(id)) return fail(400, {});

    await new Boquette(id_boquette).cancelConsommation(id, false);
  },
}