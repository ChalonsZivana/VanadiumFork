import { getCategories, getProducts } from "$lib/server/db_connection";
import type { PageServerLoad } from "./$types";

const boquettes = {
  "foys":7,
  "koenettrie":147,
}


export const load: PageServerLoad = async ({ params }) => {  
  if(!(params.boquette in boquettes)) return {}
  
  let boquette_id = (boquettes as any)[params.boquette] as number;
  let products = await getProducts(boquette_id);
  let categories = await getCategories(boquette_id);

  return {
    categories:categories,
		products:products
	}
}