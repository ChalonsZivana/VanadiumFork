import { getCategories, getProducts } from "$lib/server/db_connection";
import type { boquettes, categories, produits } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";


const k = {'koenettrie':0,'foys':0}
export type Boquette = {boquette:boquettes,categories:categories[],products:produits[]};
type Boquettes = Record<keyof typeof k, Boquette>;



export const load: PageServerLoad = async () => {    
  const t = [];

  //7:foys  147:koenettrie
  const boqs = await prisma.boquettes.findMany({select:{id_boquette:true, nom:true, nom_simple:true}, where:{id_boquette:{in:[7,147]}}});

  
  for(let boq of boqs){
    t.push([ boq.nom_simple,{boquette:boq ,categories:await getCategories(boq.id_boquette), products:await getProducts(boq.id_boquette) } ]);
  }  

  return { boquettes:Object.fromEntries(t) as Boquettes } 
}