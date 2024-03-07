import { getTopNegats } from "$lib/server/db_connection";
import { Prisma } from "@prisma/client";
import type { PageServerLoad } from "./$types";

export const GET:PageServerLoad = async ({url})=>{
  const proms = parseInt(url.searchParams.get('proms')??'');
  const top = await getTopNegats(proms);

  return new Response(JSON.stringify(top));
}