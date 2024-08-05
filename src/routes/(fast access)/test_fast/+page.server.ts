import prisma from "$lib/prisma"

export async function load() {
  const pgs = await prisma.pg.findMany({where:{proms:{in:[221,222,223]}}});
  return {
    pgs
  }
}