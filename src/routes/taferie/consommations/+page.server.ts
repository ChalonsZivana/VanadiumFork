
import { error, fail } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { PageServerLoad, RequestEvent } from "./$types.js";
import { Prisma, consommations_type } from "@prisma/client";
import { Taferie } from "$lib/server/classes/Taferie";
import { consommations, consommationsSchema } from "$lib/components/search/fullsearch.js";


export const load:PageServerLoad = async ({})=>{
  let include:Prisma.consommationsInclude = {
    from_pg:{select:{nums:true, proms:true}},
    to_pg:{select:{nums:true,proms:true}},
    to_fams:{select:{nums:true}},
    to_boquette:{select:{nom:true}}
  };
  let consommations = await prisma.consommations.findMany({
    take:100, orderBy:{date_conso:'desc'},include,
  });
  return {
    page:1,
    consommations,
    totalCons:await prisma.consommations.count()
  };
}

export let actions = {
  consommations:  async ({ request }:RequestEvent) => {
    const d = JSON.parse(await request.text());
    const data = consommationsSchema.safeParse(d);
    console.log(data)
    if(!data.success) throw error(400);
    if(data.data.consoType != null && !(data.data.consoType in consommations_type)) throw error(400);

    return consommations(data.data.consoType as consommations_type | null, data.data);
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