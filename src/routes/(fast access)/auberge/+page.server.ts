import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { getCategories, getProducts } from "$lib/server/db_connection";

// status
// 0 : dernieres commandes
// 1 : en cours de préparaition
// 2 : finish
export const load:PageServerLoad = async ()=>{
  return {
    auberge:{
      0:await aubergeGetByStatus(0),
      1:await aubergeGetByStatus(1),
      2:await aubergeGetByStatus(2),
    }
  };
}

function aubergeGetByStatus(status:number){
  return prisma.auberge.findMany({
    select: {
      id: true, bandars:true, commentaire:true, id_pg:true,fromage:true,status:true,telephone:true,type:true,
      pg: { select: {nums: true,proms: true } },
    },
    where:{status:status},
    orderBy: { id: 'desc' },
    }
  );
}