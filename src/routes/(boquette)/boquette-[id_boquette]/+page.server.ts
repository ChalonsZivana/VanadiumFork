
import { type RequestEvent, redirect, error } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { LayoutServerLoad } from "./$types.js";
import { Database } from "$lib/server/classes/Database.js";


export const load:LayoutServerLoad = async ({locals, params})=>{
  const pgs = await prisma.pg.findMany({
    where:{proms:{gte:221}}, 
    select:{nums:true,proms:true, bucque:true, id_pg:true}
  })
  return { pgs };
}



export const actions = {
  create_category: async ({ request, params }:RequestEvent) => {
    
    const data = await request.formData();
    const nom = data.get('nom_categorie')?.toString();
    if(nom == null) return {success:false};
    
    if(await Database.createCategorie({id_boquette:3, nom:nom}) == null){
      return {already_exists:true};
    }
    return { success: true};
  },
  create_product: async ({ cookies, request, url }:RequestEvent) => {
    const data = await request.formData();
    const uid = data.get('id')?.toString();
		const password = data.get('password')?.toString();
		const remember = data.get('remember')?.toString();
  },
}
