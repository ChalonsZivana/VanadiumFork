import { error } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { LayoutServerLoad } from "./$types.js";
import { Taferie } from "$lib/server/classes/Taferie.js";
import type { Prisma } from "@prisma/client";
import { hashPassword } from "$lib/server/auth.js";
import { EditBoquetteSchema, ImportRhopseSchema } from "$lib/zodSchema.js";


export const load:LayoutServerLoad = async ({params, setHeaders})=>{
  const id_boquette = parseInt(params.id_boquette);
  if(isNaN(id_boquette)) throw error(404);

  setHeaders({
    'cache-control':'max-age=3600'
  });
  
  const pgs = prisma.pg.findMany({
    where:{actif:1}, 
    select:{nums:true,proms:true, bucque:true, id_pg:true, nom:true, prenom:true}
  })
  return { 
    pgs, 
    totalCons:await prisma.consommations.count()  
  };
}



export const actions = {
  // create_category: async ({ request, params }) => {
  //   const id_boquette = parseInt(params.id_boquette);
  //   if(isNaN(id_boquette)) throw error(400);
  //   const data = await request.formData();
  //   const nom = data.get('nom_categorie')?.toString();
  //   if(nom == null) return {success:false};
    
  //   if(await Database.createCategorie({id_boquette, nom:nom}) == null){
  //     return {already_exists:true};
  //   }
  //   return { success: true};
  // },
  // create_product: async ({ request }) => {
  //   const data = Object.fromEntries(await request.formData());
  //   const d = CreateProductSchema.safeParse(data);
  //   if(!d.success) return {wrong:true}//TODO
  //   console.log("")
  // },
  import_rhopse:async({request, params}) => {
    // Attention, la rhopse doit absolument être fait avant un quelconque changement de prix
    // En effet,les prix de la rhopse ne sont pas ceux de l'excel mais ceux du server
    const id_boquette = parseInt(params.id_boquette);
    if(isNaN(id_boquette)) throw error(400);
    const d = JSON.parse(await request.text());
    const data = ImportRhopseSchema.safeParse(d);
    if(!data.success) return {error:true}

    for(let [pg, id_produit, quantite] of data.data){
      const [nums, proms] = pg.split('ch').map(e => parseInt(e));
      const pgs = await prisma.pg.findMany({where:{nums, proms}, select:{id_pg:true}});
      if(pgs.length == 0) continue;
      await Taferie.rhopse(
        {type:'pg_boq', from:pgs[0].id_pg, to:id_boquette, id_produit, quantite}
      )
    }
  },
  editBoquette:async({request, params})=>{
    const id_boquette = parseInt(params.id_boquette);
    if(isNaN(id_boquette)) throw error(404);
    const data = Object.fromEntries(await request.formData());
    const d = EditBoquetteSchema.safeParse(data);
    if(!d.success) return {success:false};

    if(d.data['Nouveau mot de passe'] != d.data['Confirmation nouveau mot de passe']) return {different_passwords:true}
    const createData:Prisma.boquettesUpdateInput = {
      nom:d.data.Nom,
      nom_simple:d.data.Identifiant,
      partie_pg:d.data['Partie PG'] == 'on' ? true:false
    }
    if(d.data['Nouveau mot de passe']!=""){
      createData.mot_de_passe = hashPassword(d.data['Nouveau mot de passe'])
    }

    await prisma.boquettes.update({
      where:{id_boquette},
      data:createData
    })
  },
}

