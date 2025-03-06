import prisma from "$lib/prisma";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, url }) => {
  if (locals.session.data.user == null) throw redirect(300, "/login");

  const appartenance_boquettes = await prisma.appartenance_boquettes.findMany({
      where:{id_pg: locals.session.data.user.pg.id_pg} 
    })
    const BOQUETTES = await prisma.boquettes.findMany({
      where:{id_boquette: {in: appartenance_boquettes.map(e => e.id_boquette)}}
    })
  

  return {
    USER: locals.session.data.user,
    BOQUETTES,
    url: url.pathname,
  };
};
