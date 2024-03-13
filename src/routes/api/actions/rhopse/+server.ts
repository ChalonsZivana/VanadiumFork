import { Boquette } from "$lib/server/classes/Boquette";
import { Pg } from "$lib/server/classes/PG";
import { error } from "@sveltejs/kit"
import { z} from 'zod';


const RhopseDataSchema  = z.object({
  id_boquette:z.number(),
  id_pg:z.number(),
  produits:z.array(z.tuple([z.number(), z.number()]))
})
type RhopseData = z.infer<typeof RhopseDataSchema>;

export async function POST({request}) {
  const data:RhopseData = JSON.parse(await request.text())
  const {success} = RhopseDataSchema.safeParse(data);
  if(!success) throw error(400,"Wrong data schema");

  const boq = await Boquette.new(data.id_boquette);
  if(boq == null) throw error(400,"Wrong boquette");
  const pg = await Pg.new(data.id_pg);
  if(pg == null)  throw error(400,"Wrong pg");

  for(let [id_produit, q] of data.produits){
    boq.rhopse({id_pg:pg.pg.id_pg,id_produit:id_produit, quantite:q});
  }

  return new Response(JSON.stringify({success:true}));
}