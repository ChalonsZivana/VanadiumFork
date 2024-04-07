import type { categories, produits } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { fail } from "@sveltejs/kit";
import { Boquette } from "$lib/server/classes/Boquette";
import { Taferie } from "$lib/server/classes/Taferie";
import { RhopseSchema } from "$lib/zodSchema";


const k = {'koenettrie':0,'foys':0}
export type RhopseBoquette = {boquette:{id_boquette:number, nom:string|null, nom_simple:string|null},categories:categories[],products:produits[]};
type Boquettes = Record<keyof typeof k, Boquette>;

const boquettesEnLibreService = [
  1, //Strass Choco
  7,//Foys
  147,//Koenettrie
];

export const load: PageServerLoad = async () => {    

  //7:foys  147:koenettrie
  const boqs = await prisma.boquettes.findMany({
    select:{id_boquette:true, nom:true, nom_simple:true}, 
    where:{partie_pg:true, id_boquette:{in:boquettesEnLibreService}}
  });

  let t:RhopseBoquette[] = [];
  for(let b of boqs){
    t.push(
      {
        boquette:b,
        categories:await prisma.categories.findMany({where:{id_boquette:b.id_boquette}, orderBy:{nom:'asc'}}), 
        products:await prisma.produits.findMany({where:{id_boquette:b.id_boquette}, orderBy:{nom:'asc'}}), 
      } 
    );
  }  

  return { boquettesLibreService:t } 
}

export const actions = {
  'rhopse':async({request, locals})=>{
    const t  = JSON.parse(await request.text());
    const parse = RhopseSchema.safeParse(t);

    if(!parse.success || !locals.session.data.user) return fail(400,{});
    const data = parse.data;
    if(!Boquette.exists(data.id_boquette)) return fail(400, {});
    
    const id_pg = locals.session.data.user.pg.id_pg;
    const boq = new Boquette(data.id_boquette);
    for(let [id_produit, quantite] of data.produits){
      await Taferie.rhopse({type:"pg_boq",from:id_pg, to:boq.ID, id_produit, quantite});
    }
  }
}