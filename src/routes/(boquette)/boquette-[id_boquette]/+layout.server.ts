import { redirect, error } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { LayoutServerLoad } from "./$types.js";
import { getProducts, getCategories } from "$lib/server/db_connection.js";


export const load:LayoutServerLoad = async ({locals, params})=>{
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);

  const produits = await getProducts(id_boquette);
  const categories = await getCategories(id_boquette);
 
  return { produits,categories, session:locals.session.data, id_boquette };
}