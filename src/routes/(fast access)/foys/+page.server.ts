import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { getCategories, getProducts } from "$lib/server/db_connection";


export const load:PageServerLoad = async ()=>{
  //7:foys  147:koenettrie
  const getNums = async(i: number) => await prisma.pg.findMany({where:{proms:i}, select:{nums:true}});

  return { 
    categories:await getCategories(7),
    products:await getProducts(7),
    proms:{
      221:await getNums(221),
      222:await getNums(222),
      223:await getNums(223),
    }
  };

  
}