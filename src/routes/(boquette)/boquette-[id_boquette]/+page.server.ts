
import { type RequestEvent, redirect, error } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { LayoutServerLoad } from "./$types.js";


export const load:LayoutServerLoad = async ({locals, params})=>{
  const pgs = await prisma.pg.findMany({
    where:{proms:{gte:221}}, 
    select:{nums:true,proms:true, bucque:true, id_pg:true}
  })
  return { pgs };
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

