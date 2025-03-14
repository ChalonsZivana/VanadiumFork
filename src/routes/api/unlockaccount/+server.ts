import prisma from "$lib/prisma.js"
import { error, json } from "@sveltejs/kit"



export async function GET({locals}){
  const pg = locals.session.data.user?.pg;
  if(!pg) throw error(400);
  await prisma.fams11pine.create({
    data:{
      nums:pg.nums, proms:pg.proms
    }
  })
  return json({})
}