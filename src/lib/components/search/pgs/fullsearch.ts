import prisma from "$lib/prisma";
import type {  PgSearchSchemaType } from "$lib/zodSchema";
import { Prisma } from "@prisma/client";


export async function pgsSearch(data:PgSearchSchemaType){
  const where:Prisma.pgWhereInput= data.proms ? {proms:data.proms} : {};
  
  let orderBy:{solde:"asc" | "desc"}|{nums:"asc" | "desc"};
  if(data.sortType == 'nums') orderBy = {nums:data.sortDir}
  else  orderBy = {solde:data.sortDir}

  let pgs = await prisma.pg.findMany({
    where,
    take:20,
    skip:20*(data.page-1),
    orderBy,
  });
  return {
    pgs: pgs,
    page:data.page,
    totalPgs:await prisma.pg.count({where})
  };
}
