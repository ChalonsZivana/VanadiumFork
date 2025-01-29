import prisma from "$lib/prisma.js";

export async function GET() {
  const pgs = await prisma.pg.findMany({
    where: { actif: true },
    select: {
      nums: true,
      proms: true,
      bucque: true,
      id_pg: true,
      nom: true,
      prenom: true,
    },
  });
  return new Response(JSON.stringify({ pgs }));
}
