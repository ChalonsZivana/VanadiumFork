
import { error } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { PageServerLoad, RequestEvent } from "./$types.js";


export const load:PageServerLoad = async ({})=>{
  const page = 1;

  if(isNaN(page))throw error(404, 'Wrong page');
  const consommations = await prisma.consommations.findMany({
    take:100,
    skip:100*(page-1),
    orderBy:{date_conso:'desc'}
  });

  return {
    page,
    consommations,
    totalCons:await prisma.consommations.count()
  };
}

export let actions = {
  consommations:  async ({ request }:RequestEvent) => {
    const data = await request.formData();
    const page = parseInt(data.get('page')?.toString()??'');
    if(isNaN(page))throw error(404, 'Wrong page');
    const orderDir = data.get('dir')?.toString() == 'c' ?'asc' :'desc';
    const y = parseInt(data.get('year')?.toString()??'');

    const date= isNaN(y) ?{}: {
        gte: new Date(`${y}-01-01`),
        lt: new Date(`${y+1}-01-01`)
    } as {gte:Date, lt:Date}

    let consommations;
    if(data.get('type')?.toString() == 'h') {
      consommations = await prisma.consommations.findMany({
        where:{date_conso:date},
        take:100,
        skip:100*(page-1),
        orderBy:{date_conso:orderDir}
      });
    } else if(data.get('type')?.toString() == 'd'){
      consommations = await prisma.consommations.findMany({
        where:{date_conso:date},
        take:100,
        skip:100*(page-1),
        orderBy:{debit:orderDir}
      });
    } else {
      consommations = await prisma.consommations.findMany({
        where:{date_conso:date},
        take:100,
        skip:100*(page-1),
        orderBy:{credit:orderDir}
      });
    }

    return {
      consommations,
      page:page,
      totalCons:await prisma.consommations.count({where:{date_conso:date}})
    };
  }
}