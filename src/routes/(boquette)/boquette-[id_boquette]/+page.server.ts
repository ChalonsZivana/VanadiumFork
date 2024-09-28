import { Boquette } from '$lib/server/classes/Boquette.js';
import { Taferie } from '$lib/server/classes/Taferie.js';
import { EditBoquetteSchema, ImportRhopseSchema, RhopseSchema } from '$lib/zodSchema.js';
import { error, fail } from '@sveltejs/kit';

export const actions = {
  editBoquette:async({request, params})=>{
    const id_boquette = parseInt(params.id_boquette);
    if(!id_boquette) throw error(400);
    const d = Object.fromEntries(await request.formData());
    const data = EditBoquetteSchema.safeParse(d);
    if(!data.success) return fail(400, {success:false, message:"Something went wrong"})
    
    new Boquette(id_boquette).editBoquette(data.data);
  },
  import_rhopse:async({request,params})=>{
    const id_boquette = parseInt(params.id_boquette);
    if(!id_boquette) throw error(400);
    const d = Object.fromEntries(await request.formData());
    const data = ImportRhopseSchema.safeParse(d);
    if(!data.success) return fail(400, {success:false, message:"Something went wrong"})
      console.log(data)
    const results:Awaited<ReturnType<typeof Taferie.rhopse>>[] = [];
    for(let [id_pg, id_produit, quantite, rhopsePourUnAncien] of data.data.produits){
      const conso = await Taferie.rhopse({
        type:'pg_boq',
        from:id_pg,
        to:id_boquette,
        id_produit:id_produit,
        quantite:quantite,
        rhopse_ancien:rhopsePourUnAncien,
      }, true);
      results.push(conso);
    }
    return {
      results
    }
  }
}