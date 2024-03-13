import { error, fail } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types.js";
import { Boquette } from "$lib/server/classes/Boquette";


export const load:LayoutServerLoad = async ({locals, params})=>{
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);

  const boq = await Boquette.new(id_boquette);
  if(boq == null) throw fail(404);

  const produits = await boq.produits();
  const categories = await boq.categories();
 
  return { produits,categories, session:locals.session.data, id_boquette };
}