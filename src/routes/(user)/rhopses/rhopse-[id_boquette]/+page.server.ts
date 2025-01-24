import prisma from "$lib/prisma";
import { BOQUETTES, BOQUETTES_LIBRE_SERVICE } from "$lib/server/classes/Boquette.js";
import { Taferie } from "$lib/server/classes/Taferie.js";
import { RhopseSchema } from "$lib/zodSchema.js";
import type { categories, produits } from "@prisma/client";
import { error, fail } from "@sveltejs/kit";

export type RhopseBoquette = {boquette:{id_boquette:number, nom:string|null, nom_simple:string|null},categories:categories[],products:produits[]};


export const load = async ({params}) => {    
  const id_boquette = parseInt(params.id_boquette);
  if(!Object.values(BOQUETTES_LIBRE_SERVICE).includes(id_boquette)) throw error(404);
  //7:foys  147:koenettrie
  const boquettes = await prisma.boquettes.findMany({
    select:{id_boquette:true, nom:true, nom_simple:true}, 
    where:{id_boquette}
  });

  if(boquettes.length == 0) throw error(400);

  const categories = await prisma.categories.findMany({where:{id_boquette}, orderBy:{nom:'asc'}});
  const products = await prisma.produits.findMany({where:{id_boquette}, orderBy:{nom:'asc'}});

  return { categories, products, id_boquette:boquettes[0].id_boquette } 
}


export const actions = {
  'rhopse':async({request, locals, params})=>{
    const id_boquette = parseInt(params.id_boquette);
    const rhopseur = locals.session.data.user;
    if(isNaN(id_boquette) || !Object.values(BOQUETTES).includes(id_boquette)) throw error(404);
    if(!rhopseur) throw error(400);
    const rhopseur_string = `${rhopseur.pg.nums}ch${rhopseur.pg.proms}`;
    const t  = Object.fromEntries(await request.formData());
    const parse = RhopseSchema.safeParse(t);

    if(!parse.success || !locals.session.data.user) return fail(400,{});
    const data = parse.data;
    
    const id_pg = locals.session.data.user.pg.id_pg;

    const results:Awaited<ReturnType<typeof Taferie.rhopse>>[] = []
    for(let [id_produit, quantite] of data.produits){
      const r = await Taferie.rhopse({type:"pg_boq",from:id_pg, to:id_boquette, id_produit, quantite,rhopse_ancien:null, rhopseur:rhopseur_string});
      results.push(r);
    }
    return results[0]
  }
}