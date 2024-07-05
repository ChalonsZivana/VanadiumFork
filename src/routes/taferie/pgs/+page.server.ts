
import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { Taferie } from "$lib/server/classes/Taferie";
import { pgsSearch } from "$lib/components/search/pgs/fullsearch";
import { PgSearchSchema } from "$lib/zodSchema.js";


export const load:PageServerLoad = async ({})=>{
  return {
    search:await pgsSearch(
      { sortDir:'desc',sortType:'nums',proms:NaN, page:1}
    )
  };
}

export let actions = {
  pgs:  async ({ request }) => {
    const d = Object.fromEntries(await request.formData());
    const data = PgSearchSchema.safeParse(d);
    
    if(!data.success) throw error(400);
    return {
      search:await pgsSearch(data.data)
    }
  },
  cancel:async({request})=>{
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString()??'');
    if(isNaN(id)) return fail(400, {});

    await Taferie.cancelConsommation(id, true);
  },
  uncancel:async({request})=>{
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString()??'');
    if(isNaN(id)) return fail(400, {});

    await Taferie.cancelConsommation(id, false);
  }
}