import { createPool } from 'mysql2';
import prisma from "$lib/prisma";
import type { Top } from './db_structs';
import type { categories, photos, produits } from '@prisma/client';

let pool = createPool({
  host:'127.0.0.1',
  user:'root',
  password:'password',
  database:'vanadium',
  connectionLimit:10,
  waitForConnections:true,
  queueLimit:0,
});

const promisePool = pool.promise();

export async function query(sql:string, values:any) {
  const [rows, fields] = await promisePool.query(sql, values);
  return rows;
}

export async function getFams(nums:number) {
  if(nums > 50){
    nums = Math.abs(100 - nums);
  }
  if(nums == 0) nums = 50;
  return prisma.fams.findFirst({where:{nums:nums}});
}

export async function getPhotosFolder(id_pg:number) {
  return await prisma.photos.findFirst({where:{id_pg:id_pg}});
}

export async function getProducts(id_boquette:number) {
	return await prisma.produits.findMany({where:{id_boquette:id_boquette}}) as produits[];
}

export async function getCategories(id_boquette:number) {
  return prisma.categories.findMany(
    { where:{id_boquette:id_boquette}}
  );
}



export const getUserPassword = async (nums:number,proms:number) => {
  return prisma.pg.findFirst({select:{id_pg:true, mot_de_passe:true}, where:{nums:nums,proms:proms}});
}

export const getUser = async (id_pg:number)=> {
  if(id_pg == -1){
    return null;
  }
  // MAIN INFO ABOUT PG
  return prisma.pg.findFirst({where:{id_pg:id_pg}});
}

export const getHistoriqueFams = async (nums:number) => {
  nums = Math.abs(100 - nums);
  if(nums == 0) nums = 50;

  return prisma.historique_fams.findMany({where:{fams:nums}});
}

export const getBoquette = async (id_boquette:number)=> {
  return prisma.boquettes.findFirst({where:{id_boquette:id_boquette}});
}

export const getTops = async ()=>{
  const tops:Top[] = [];

  const tr = await prisma.refresh.findMany({
    select: {
      nombre: true,
      pg: { select: {nums: true,proms: true,bucque: true } },
    },
    orderBy: { nombre: 'desc' },
    take: 10,
    }
  );
  tops.push(
    {
      name:"Refresh",
      leaderboard:tr.map((e)=>{
        return {nombre:e.nombre,nums:e.pg.nums,proms:e.pg.proms,bucque:e.pg.bucque}
      })
    }
  )

  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 30);//TODO 30 -> 14

  const boquettes = {
    "Foys":7,
    "Auberge":3,
    "Strass Choco":1,
    "Mousse":10,
    "Copalerie":17,
    "Cock's":4,
    "Koenettrie":147,
    "K've":2,
  }

  for(let [nom, id_boquette] of Object.entries(boquettes)){
    const a = await prisma.consommations.groupBy(
      {
        by:['id_pg'],
        where:{ id_pg:{ gt:0 }, date_conso:{ gte:twoWeeksAgo.toISOString() }, id_boquette:id_boquette },
        orderBy: { _sum: { debit:'desc' } },
        take:10,
        _sum: { debit:true }
      }
    );
    // create leaderboard
    const leaderboard = [];

    const ids_pg = a.map(e=>e.id_pg) as number[];
    const pgs = await prisma.pg.findMany({where:{id_pg:{in:ids_pg}},select:{id_pg:true,nums:true, proms:true, bucque:true}});
    for(let e of a){
      const pg = pgs.find((i)=>i.id_pg == e.id_pg);
      if(pg == undefined) continue;
      leaderboard.push({nombre:null,nums:pg.nums,proms:pg.proms, bucque:pg.bucque})
    }

    tops.push({ name:nom, leaderboard:leaderboard });
  }

  return tops;
}