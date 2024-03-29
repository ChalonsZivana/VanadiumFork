import prisma from "$lib/prisma";
import { Taferie } from "$lib/server/classes/Taferie";
import { Prisma, consommations_type } from "@prisma/client";
import { z } from "zod";


export const consommationsSchema  = z.object({
  page:z.number(),
  nums: z.union([z.number(), z.null()]),
  proms: z.union([z.number(), z.null()]),
  sortType: z.enum(['date','montant']),
  sortDir: z.enum(['asc', 'desc']),
  consoType:z.union([z.string(),z.null()]),
  consoYear:z.union([z.number(), z.null()]),
});

export async function consommations(consoType:consommations_type | null,data:z.infer<typeof consommationsSchema>){
  const whereDate = data.consoYear ? { 
    gte: new Date(`${data.consoYear}-01-01`),
    lt: new Date(`${data.consoYear+1}-01-01`)
  } : {};
  const whereNums = data.nums ? {nums:data.nums} : {};
  const whereProms = data.proms ? {proms:data.proms} : {};
  const whereConsoType = consoType ? {type:consoType} : {};

  const where = {...whereDate, ...whereNums, ...whereProms, ...whereConsoType};
  console.log(where);
  let orderBy:{date_conso:"asc" | "desc"}|{montant:"asc" | "desc"}|{montant:"asc" | "desc"};
  if(data.sortType == 'date') orderBy = {date_conso:data.sortDir}
  else  orderBy = {montant:data.sortDir}
  let include:Prisma.consommationsInclude = {
    from_pg:{select:{nums:true, proms:true}},
    to_pg:{select:{nums:true,proms:true}},
    to_fams:{select:{nums:true}},
    to_boquette:{select:{nom:true}}
  };
  let consommations = await prisma.consommations.findMany({
    where,
    take:100,
    skip:100*(data.page-1),
    orderBy,
    include,
  });


  return {
    consommations,
    page:data.page,
    totalCons:await prisma.consommations.count({where})
  };
}
