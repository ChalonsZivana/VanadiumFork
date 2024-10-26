import prisma from "$lib/prisma";
import type { pg } from "@prisma/client";
import { Fams } from "./classes/Fams";
import { Pg } from "./classes/PG";
import type { Top } from './db_structs';

export async function getFams(nums:number) {
  const fams = new Fams(nums)
  return prisma.fams.findFirst({where:{nums:fams.ID}});
}


export const getPGPassword = async (nums:number,proms:number) =>  {
  const data = await prisma.pg.findFirst({select:{id_pg:true, mot_de_passe:true}, where:{nums:nums,proms:proms}});
  return data
}

export const getPG = async (id_pg:number) => {
  if(id_pg == -1){
    return null;
  }
  return prisma.pg.findFirst({where:{id_pg}});
}

export const getHistoriqueFams = async (nums:number) => {
  nums = Math.abs(100 - nums);
  if(nums == 0) nums = 50;

  return prisma.consommations.findMany({
    where:{type:{in:['ext_fams', 'pg_fams']}}, 
    include:{
      from_pg:{select:{nums:true, proms:true}},
      to_pg:{select:{nums:true,proms:true}},
      to_fams:{select:{nums:true}},
      to_boquette:{select:{nom:true}}
    }
  });
}

export const getBoquette = async (id_boquette:number)=> {
  return prisma.boquettes.findFirst({where:{id_boquette}});
}

function isMoreThanAWeekOld(date: Date): boolean {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return date < oneWeekAgo;
}


const TopsBoquettes = {
  "Foys":7,
  "Mam'serie":193,
  "Auberge":3,
  "Strass Choco":1,
  "Mousse":10,
  "Copalerie":17,
  "Cock's":4,
  "Koenettrie":147,
  "K've":2,
}

export const getTopRefresh = async () =>{
  const tr = await prisma.refresh.findMany({
    select: {
      nombre: true,
      pg: { select: {nums: true,proms: true,bucque: true } },
    },
    orderBy: { nombre: 'desc' },
    take: 10,
    }
  );
  return {
      name:"Refresh",
      leaderboard:tr.map((e)=>{
        return {nombre:e.nombre,nums:e.pg.nums,proms:e.pg.proms,bucque:e.pg.bucque}
      })
  }
}

export const getTop = async (name:string, id_boquette:number|null, d={jours:365,take:10}):Promise<Top> => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - d.jours);//TODO 30 -> 14

  const a = await prisma.consommations.groupBy(
      {
        by:['from'],
        where:id_boquette == null ? 
          { type:"pg_boq", from:{ gt:0 }, date_conso:{ gte:twoWeeksAgo.toISOString() }, from_pg:{solde:{gte:0}} } :
          { type:"pg_boq", from:{ gt:0 }, date_conso:{ gte:twoWeeksAgo.toISOString() }, from_pg:{solde:{gte:0}}, to:id_boquette },
        orderBy: { _sum: { montant:'asc' } },
        take:d.take,
        _sum: { montant:true }
      }
    );
  // create leaderboard
  const leaderboard = [];

  const ids_pg = a.map(e=>e.from) as number[];
  const pgs = await prisma.pg.findMany({where:{id_pg:{in:ids_pg}},select:{id_pg:true,nums:true, proms:true, bucque:true}});
  for(let e of a){
    const pg = pgs.find((i)=>i.id_pg == e.from);
    if(pg == undefined) continue;
    leaderboard.push({nombre:null,nums:pg.nums,proms:pg.proms, bucque:pg.bucque})
  }

  return { name, leaderboard }
}

export const getRandomTop = async () => {
  const keys = Object.keys(TopsBoquettes) as (keyof typeof TopsBoquettes)[];
  const randomIndex = Math.floor(Math.random() * keys.length);
  const top = keys[randomIndex];
  return getTop(top, TopsBoquettes[top]);
}

export const getTops = async ()=>{
  const tops:Top[] = [
    // await getTopRefresh()
  ];

  for(let [nom, id_boquette] of Object.entries(TopsBoquettes)){
    tops.push(await getTop(nom, id_boquette));
  }

  return tops;
}

export const getTopNegats = async (proms:number)=>{
  return await prisma.pg.findMany(
    {
      where:isNaN(proms)?{}:{proms:proms},
      select:{nums:true,proms:true,bucque:true,solde:true,id_pg:true},
      orderBy:{solde:'asc'},
      take:10
    }
  )
}