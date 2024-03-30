import prisma from "$lib/prisma";
import type { ConsommationsIncludeType } from "$lib/server/classes/Taferie";
import { Prisma, consommations_type } from "@prisma/client";
import { z } from "zod";


export const consommationsSchema  = z.object({
  page:z.string(),
  nums: z.union([z.string(), z.null()]),
  proms: z.union([z.string(), z.null()]),
  sortType: z.enum(['date','montant']),
  sortDir: z.enum(['asc', 'desc']),
  consoType:z.string(),
  consoYear:z.union([z.string(), z.null()]),
}).transform(data => ({
  ...data,
  page: parseInt(data.page), // Convert page to integer
  nums: data.nums !== null ? parseInt(data.nums) : null, // Convert nums to integer
  proms: data.proms !== null ? parseInt(data.proms) : null, // Convert proms to integer
  consoYear: data.consoYear !== null ? parseInt(data.consoYear) : null // Convert consoYear to integer
}));

export async function consommationsSearch(types:({type:consommations_type, from:number}|{type:consommations_type, to:number}|{type:consommations_type})[] | null,data:z.infer<typeof consommationsSchema>){
  const whereDate:Prisma.consommationsWhereInput = data.consoYear ? {
    date_conso:{ 
      gte: new Date(`${data.consoYear}-01-01`),
      lt: new Date(`${data.consoYear+1}-01-01`)
    }
  } : {};
  const whereNums:Prisma.consommationsWhereInput = data.nums ? {from_pg:{nums:data.nums}} : {};
  const whereProms:Prisma.consommationsWhereInput = data.proms ? {from_pg:{proms:data.proms}} : {};

  const whereType = types ? (types.length > 1 ? {OR:types} : types[0]) : {};
  
  const where:Prisma.consommationsWhereInput = {...whereDate, ...whereNums, ...whereProms, ...whereType};

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
    consommations: consommations as ConsommationsIncludeType[],
    page:data.page,
    totalCons:await prisma.consommations.count({where})
  };
}
