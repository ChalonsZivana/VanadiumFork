
import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { consommations_type } from "@prisma/client";
import { Taferie } from "$lib/server/classes/Taferie";
import { consommationsSearch } from "$lib/components/search/fullsearch.js";
import { ConsommationsSchema } from "$lib/zodSchema.js";


export const load:PageServerLoad = async ({})=>{
  return {
    search:await consommationsSearch(
      null, 
      { consoType:'',consoYear:NaN,sortDir:'desc',sortType:'date',nums:NaN,proms:NaN, page:1}
    )
  };
}

export let actions = {
  consommations:  async ({ request }) => {
    const d = Object.fromEntries(await request.formData());
    const data = ConsommationsSchema.safeParse(d);

    if(!data.success) throw error(400);

    if(data.data.consoType != 'Tout' && !(data.data.consoType in consommations_type)) throw error(400);
    const consoType = data.data.consoType as consommations_type | 'Tout';

    return {
      search:await consommationsSearch(
        consoType == 'Tout' ? null : [{type:consoType}], data.data
      )
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