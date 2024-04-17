import prisma from '$lib/prisma.js';
import { error } from '@sveltejs/kit';

export async function load({locals}){
  const user = locals.session.data.user;
  if(user == null) throw error(404);
  if(user.pg.ddp == 0) throw error(401)
  const proms = user.pg.proms;
  return {
    pgs:await prisma.pg.findMany({where:{proms}, select:{nums:true, proms:true, bucque:true, solde:true,email:true}}),
    proms
  }
}