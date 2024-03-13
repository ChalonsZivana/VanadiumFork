import { Boquette } from "$lib/server/classes/Boquette";
import { Database } from "$lib/server/classes/Database";
import { fail } from "@sveltejs/kit";

export const load = async ()=>{
  //7:foys  147:koenettrie
  const boq = await Boquette.new(7);
  if(boq == null) throw fail(400, {  })
  
  return { 
    categories:await boq.categories(),
    products:await boq.produits(),
    proms:{
      221:await Database.getNumsInProms(221),
      222:await Database.getNumsInProms(222),
      223:await Database.getNumsInProms(223),
    }
  };
}