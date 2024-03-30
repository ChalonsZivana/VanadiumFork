import { consommationsSearch, consommationsSchema } from '$lib/components/search/fullsearch.js';
import prisma from '$lib/prisma.js';
import { hashPassword } from '$lib/server/auth.js';
import { Boquette } from '$lib/server/classes/Boquette.js';
import { Taferie } from '$lib/server/classes/Taferie.js';
import { Prisma, consommations_type } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';
import { z } from 'zod';

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
    const data = consommationsSchema.safeParse(d);
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
  "editBoquette":async({request, params})=>{
    const id_boquette = parseInt(params.id_boquette);
    if(isNaN(id_boquette)) throw error(404);
    const data = Object.fromEntries(await request.formData());
    const d = EditBoquetteSchema.safeParse(data);
    if(!d.success) return {success:false};

    if(d.data['Nouveau mot de passe'] != d.data['Confirmation nouveau mot de passe']) return {different_passwords:true}
    const createData:Prisma.boquettesUpdateInput = {
      nom:d.data.Nom,
      nom_simple:d.data.Identifiant,
      partie_pg:d.data['Partie PG'] == 'on' ? true:false
    }
    if(d.data['Nouveau mot de passe']!=""){
      createData.mot_de_passe = hashPassword(d.data['Nouveau mot de passe'])
    }

    await prisma.boquettes.update({
      where:{id_boquette},
      data:createData
    })
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

const EditBoquetteSchema  = z.object({
  Nom:z.string(),
  Identifiant:z.string(),
  "Nouveau mot de passe":z.string(),
  "Confirmation nouveau mot de passe":z.string(),
  "Partie PG": z.union([z.literal('on'), z.undefined()])
})
