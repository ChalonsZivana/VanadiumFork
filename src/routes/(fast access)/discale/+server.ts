import prisma from "$lib/prisma";
import type { RequestHandler } from "@sveltejs/kit"

export const POST:RequestHandler = async({request,locals}) => {
  const musicId = parseInt(await request.json().catch());

  if(isNaN(musicId)) return new Response('');
  
  await prisma.spotify.delete({where:{id:musicId}}).catch(e=>{});

  return new Response('');
}
