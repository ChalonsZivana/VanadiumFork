import prisma from "$lib/prisma";
import type { ConsommationsIncludeType } from "$lib/server/classes/Taferie";
import type { ConsommationsSchemaType } from "$lib/zodSchema";
import { Prisma, consommations_type } from "@prisma/client";



export async function consommationsSearch(types:({type:consommations_type, from:number}|{type:consommations_type, to:number}|{type:consommations_type})[] | null,data:ConsommationsSchemaType){
  console.log(data)
  const whereDate:Prisma.consommationsWhereInput = data.consoYear ? {
    date_conso:{ 
      gte: new Date(`${data.consoYear}-01-01`),
      lt: new Date(`${data.consoYear+1}-01-01`)
    }
  } : {};
  const whereNums:{nums:number}|{} = data.nums ? {nums:data.nums} : {};
  const whereProms:{proms:number}|{} = data.proms ? {proms:data.proms} : {};
  const wherePg:Prisma.consommationsWhereInput = {from_pg:{...whereNums, ...whereProms}}

  const whereType = types ? (types.length > 1 ? {OR:types} : types[0]) : {};
  
  const where:Prisma.consommationsWhereInput = {...whereDate, ...wherePg, ...whereType};

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
