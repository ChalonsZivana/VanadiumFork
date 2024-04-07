import { consommationsSearch } from '$lib/components/search/fullsearch.js';
import prisma from '$lib/prisma.js';
import { Boquette } from '$lib/server/classes/Boquette.js';
import { Taferie } from '$lib/server/classes/Taferie.js';
import { ConsommationsSchema } from '$lib/zodSchema.js';
import { consommations_type } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';

export async function load({params}){
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);
  const boquette =await prisma.boquettes.findFirst({where:{id_boquette}});
  if(boquette == null) throw error(404);

  return {
    boquette,
    produits:await prisma.produits.findMany({where:{id_boquette}}),
    categories:await prisma.categories.findMany({where:{id_boquette}}),
    search:await consommationsSearch(
      [{type:'ext_boq', to:id_boquette},{type:'pg_boq', to:id_boquette}], 
      { consoType:'',consoYear:null,sortDir:'desc',sortType:'date',nums:null,proms:null, page:1}
    ),
  }
}


export let actions = {
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
  produits:async({params}) =>{
    const id_boquette = parseInt(params.id_boquette);
    if(isNaN(id_boquette)) throw error(404);
    return await prisma.produits.findMany({where:{id_boquette}});
  },
  transfert:async ({request, params})=>{
    const data = await request.formData();
    const montant = parseFloat(data.get("montant")?.toString()??'');
    const libelle = data.get('libelle')?.toString() ?? '';
    const id_boquette = parseInt(params.id_boquette);
    if(isNaN(montant) || isNaN(id_boquette)) throw error(400);

    await Taferie.rhopse({type:"ext_boq", to:id_boquette, montant:-montant, libelle});
  },
  cancel:async({request, params})=>{
    const id_boquette = parseInt(params.id_boquette);
    if(isNaN(id_boquette)) throw error(400);
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString()??'');
    if(isNaN(id)) return fail(400, {});

    await new Boquette(id_boquette).cancelConsommation(id_boquette, true);
  },
  uncancel:async({request, params})=>{
    const id_boquette = parseInt(params.id_boquette);
    if(isNaN(id_boquette)) throw error(400);
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString()??'');
    if(isNaN(id)) return fail(400, {});

    await new Boquette(id_boquette).cancelConsommation(id_boquette, false);
  },
}

