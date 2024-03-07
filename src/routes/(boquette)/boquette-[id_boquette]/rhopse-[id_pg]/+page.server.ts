import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Pg } from "$lib/server/classes/PG";

export const load:PageServerLoad = async ({params})=>{
  const pg = await Pg.new(parseInt(params.id_pg));
  if(pg == null) throw error(400);
  return {pg:pg.pg}
}