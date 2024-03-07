import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { getTopNegats } from "$lib/server/db_connection";



const currentProms = [221,222,223]


export const load:PageServerLoad = async ({locals})=>{
  return {
    topNegats:await getTopNegats(null),
    fondsProms: await fondsProms(),
    negatsProms: await negatsProms(),
    boquettes:await prisma.boquettes.findMany({select:{nom:true,nom_simple:true,id_boquette:true, solde:true}}),
    pgs:await prisma.pg.findMany({select:{bucque:true, nums:true, proms:true, id_pg:true, solde:true},orderBy:{proms:'desc'}}),
    fams:await prisma.fams.findMany()
  };
}

async function fondsProms(){
  const a = await prisma.pg.groupBy(
    {
      by:['proms'],
      where:{ id_pg:{ gt:0 },proms:{in:currentProms}},
      orderBy: { proms:'desc'},
      take:10,
      _sum: { solde:true }
    }
  );

  return Object.fromEntries(a.map(e=>[e.proms, e._sum.solde]))
}

async function negatsProms(){
  const a = await prisma.pg.groupBy(
    {
      by:['proms'],
      where:{ id_pg:{ gt:0 }, solde:{lt:0},proms:{in:currentProms}},
      orderBy: { proms:'desc'},
      take:10,
      _sum: { solde:true }
    }
  );

  return Object.fromEntries(a.map(e=>[e.proms, e._sum.solde]))
}

async function fondsBoquettes(){
  return await prisma.boquettes.findMany(
    {select:{nom:true,solde:true}, orderBy:{nom:'asc'}}
  );
}