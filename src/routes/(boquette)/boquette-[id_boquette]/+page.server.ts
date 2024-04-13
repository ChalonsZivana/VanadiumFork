import { Boquette } from '$lib/server/classes/Boquette.js';
import { EditBoquetteSchema } from '$lib/zodSchema.js';
import { error, fail } from '@sveltejs/kit';

export const actions = {
  editBoquette:async({request, params})=>{
    const id_boquette = parseInt(params.id_boquette);
    if(!id_boquette) throw error(400);
    const d = Object.fromEntries(await request.formData());
    const data = EditBoquetteSchema.safeParse(d);
    if(!data.success) return fail(400, {success:false, message:"Something went wrong"})
    
    new Boquette(id_boquette).editBoquette(data.data);
  }
}