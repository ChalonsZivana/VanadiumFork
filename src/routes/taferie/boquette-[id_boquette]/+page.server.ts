import { consommationsSearch } from '$lib/components/search/consommations/fullsearch';
import prisma from '$lib/prisma';
import { Boquette } from '$lib/server/classes/Boquette.js';
import { Taferie } from '$lib/server/classes/Taferie.js';
import { ConsommationsSchema } from '$lib/zodSchema.js';
import { consommations_type } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';

export async function load({params, url}){
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);

  const queryParams = Object.fromEntries(url.searchParams.entries());


  const boquette =await prisma.boquettes.findFirst({where:{id_boquette}});
  if(boquette == null) throw error(404);

  const data = ConsommationsSchema.safeParse(queryParams);
  console.log(data)
  if(!data.success) throw error(400);

  if(!['Tout', 'pg_boq', 'ext_boq'].includes(data.data.consoType)) throw error(400);
  const consoType = data.data.consoType as consommations_type | 'Tout';

  return {
    boquette,
    produits:await prisma.produits.findMany({where:{id_boquette}}),
    categories:await prisma.categories.findMany({where:{id_boquette}}),
    search:await consommationsSearch(
      consoType == 'Tout' ? [{type:'ext_boq', to:id_boquette},{type:'pg_boq', to:id_boquette}]: [{type:consoType, to:id_boquette}], 
      data.data
    )
  }
}


export let actions = {
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

