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
  'rhopse':async({request, params})=>{
    const id_boquette = parseInt(params.id_boquette);
    if(!id_boquette) throw error(400);
    const id_pg = parseInt(params.id_pg);
    if(!id_pg) throw error(400);
    
    const t = Object.fromEntries(await request.formData());
    const parse = RhopseSchema.safeParse(t);
    
    if(!parse.success) return fail(400,{});
    const data = parse.data;
    if(!Boquette.exists(id_boquette)) return fail(400, {});
    
    const boq = new Boquette(id_boquette);

    const results:Awaited<ReturnType<typeof Taferie.rhopse>>[] = []
    for(let [id_produit, quantite] of data.produits){
      const r = await Taferie.rhopse({type:"pg_boq",from:id_pg, to:boq.ID, id_produit, quantite});
      results.push(r)
    }
    console.log(results)
    return results
  }
}