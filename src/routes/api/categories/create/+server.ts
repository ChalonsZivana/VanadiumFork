import { Database } from '$lib/server/classes/Database.js';
import { error } from '@sveltejs/kit';
import { z} from 'zod';


const DataSchema  = z.object({
  id_boquette:z.number(),
  nom:z.string(),
})
type RhopseData = z.infer<typeof DataSchema>;

export async function POST({request}) {
  const data:RhopseData = JSON.parse(await request.text())
  const {success} = DataSchema.safeParse(data);
  if(!success) throw error(400,"Wrong data schema");

  const result = await Database.createCategorie(data);
  if(result == null){
    throw error(400,"Category already exists");
  }
  return new Response(JSON.stringify({success:true}));
}