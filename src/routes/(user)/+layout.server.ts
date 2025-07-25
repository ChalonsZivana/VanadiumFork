import prisma from "$lib/prisma";
import { redirect } from "@sveltejs/kit";
const requiredInput = "Y a que la fams 11 qui pine."

export const load = async ({ locals, url }) => {
  if (locals.session.data.user == null) throw redirect(300, "/login");

  const appartenance_boquettes = await prisma.appartenance_boquettes.findMany({
      where:{id_pg: locals.session.data.user.pg.id_pg} 
    })

    const isAccountLocked = await prisma.fams11pine.findFirst({
      where:{nums:locals.session.data.user.pg.nums, proms:locals.session.data.user.pg.proms}
    })

  const BOQUETTES_IDS = await prisma.boquettes.findMany({
    where:{id_boquette: {in: appartenance_boquettes.map(e => e.id_boquette)}},
    select:{id_boquette:true}
  })

  return {
    USER: locals.session.data.user,
    BOQUETTES_IDS,
    url: url.pathname,
    requiredToUnlock: null//isAccountLocked==null ? requiredInput : null
  };
};
