
import { getBoquette, getCategories, getProducts } from "$lib/server/db_connection";
import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types.js";


export const load:PageServerLoad = async ()=>{
  const produits = await getProducts(3);
  const categories = await getCategories(3);
  const boquette = await getBoquette(3);
  
  const pgs = await prisma.pg.findMany({
    where:{proms:{gte:221}}, 
    select:{nums:true,proms:true, bucque:true}
  })
  return {
    pgs:pgs,
    boquette:boquette,
    produits:produits,
    categories:categories,
  };
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

