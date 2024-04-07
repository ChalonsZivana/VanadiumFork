import prisma from "$lib/prisma";
import { Boquette } from "$lib/server/classes/Boquette";
import { Database } from "$lib/server/classes/Database";
import { Taferie } from "$lib/server/classes/Taferie";
import { RhopseSchema } from "$lib/zodSchema.js";
import { fail } from "@sveltejs/kit";

export const load = async ()=>{
  //7:foys  147:koenettrie
  const id_boquette = 7;
  const boq = await Boquette.exists(id_boquette);
  if(boq == null) throw fail(400, {  })
  
  return { 
    categories:await prisma.categories.findMany({where:{id_boquette}, orderBy:{nom:'asc'}}),
    products:await prisma.produits.findMany({where:{id_boquette}, orderBy:{nom:'asc'}}),
    proms:{
      221:await Database.getNumsInProms(221),
      222:await Database.getNumsInProms(222),
      223:await Database.getNumsInProms(223),
    }
  };
}

export const actions = {
  'rhopse':async({request})=>{
    const t = JSON.parse(await request.text());
    console.log(t)
    const parse = RhopseSchema.safeParse(t);
    
    if(!parse.success) return fail(400,{});
    const data = parse.data;
    if(!Boquette.exists(data.id_boquette)) return fail(400, {});
    
    const boq = new Boquette(data.id_boquette);
    console.log(boq.ID)
    for(let [id_produit, quantite] of data.produits){
      await Taferie.rhopse({type:"pg_boq",from:data.id_pg, to:boq.ID, id_produit, quantite});
    }
  }
}