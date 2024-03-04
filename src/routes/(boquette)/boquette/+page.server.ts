
import { type RequestEvent, redirect } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types.js";
import { getProducts, getCategories } from "$lib/server/db_connection.js";


export const load:PageServerLoad = async ({url, locals, parent})=>{
  const data = await parent()
  
  if(isNaN(data.id_boquette)) throw redirect(303, '/login');

  const produits = await getProducts(data.id_boquette);
  const categories = await getCategories(data.id_boquette);
  
  const pgs = await prisma.pg.findMany({
    where:{proms:{gte:221}}, 
    select:{nums:true,proms:true, bucque:true}
  })
  return { pgs,produits,categories, session:locals.session.data };
}


export const actions = {
  create_category: async ({ cookies, request, url }:RequestEvent) => {
    const data = await request.formData();
    const nom = data.get('nom_categorie')?.toString();
    if(nom == null) return {success:false};
    // Verifier que la catégorie n'existe pas dans la boquette
    const verif = await prisma.categories.findFirst({
      where:{id_boquette:3, nom:nom}
    })
    if(verif != null) return {already_exists:true}

    await prisma.categories.create({
      data: {
        id_boquette:3,
        nom:nom, 
      }
    })

    return {}
  },
  create_product: async ({ cookies, request, url }:RequestEvent) => {
    const data = await request.formData();
    const uid = data.get('id')?.toString();
		const password = data.get('password')?.toString();
		const remember = data.get('remember')?.toString();
  },
}

