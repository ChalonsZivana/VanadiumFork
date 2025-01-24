import { error, fail } from "@sveltejs/kit";
import { Pg } from "$lib/server/classes/PG";
import { Boquette } from "$lib/server/classes/Boquette";
import { Taferie } from "$lib/server/classes/Taferie";
import { RhopseSchema } from "$lib/zodSchema";

export const load = async ({params})=>{
  const id_pg = parseInt(params.id_pg);
  if(isNaN(id_pg) || !Pg.exists(id_pg)) throw error(400);
  const pg = new Pg(parseInt(params.id_pg));

  return {pg:await pg.pg()}
}



export const actions = {
  'rhopse':async({request, params, locals})=>{
    const id_boquette = parseInt(params.id_boquette);
    const id_pg = parseInt(params.id_pg);
    const rhopseur = locals.session.data.user;

    if(!id_boquette || !id_pg || !rhopseur) throw error(400);
    const rhopseur_string = `${rhopseur.pg.nums}ch${rhopseur.pg.proms}`;
    
    const t = Object.fromEntries(await request.formData());
    const parse = RhopseSchema.safeParse(t);
    
    if(!parse.success) return fail(400,{});
    const data = parse.data;

    if(!Boquette.exists(id_boquette)) return fail(400, {});
    
    const boq = new Boquette(id_boquette);

    const results:Awaited<ReturnType<typeof Taferie.rhopse>>[] = []
    for(let [id_produit, quantite] of data.produits){
      const r = await Taferie.rhopse({type:"pg_boq",from:id_pg, to:boq.ID, id_produit, quantite, rhopse_ancien:data.rhopse_ancien??null, rhopseur:rhopseur_string});
      results.push(r)
    }
    return results
  }
}