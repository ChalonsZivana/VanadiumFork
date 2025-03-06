import prisma from '$lib/prisma.js';
import { AjouterMembreSchema, topNegatsSchema } from '$lib/zodSchema.js';
import { error, fail } from '@sveltejs/kit';
import { z } from 'zod';

export const load = async ({ params, locals }) => {
  const id_boquette = parseInt(params.id_boquette);
  if (isNaN(id_boquette)) throw error(404);

  const boquette = await prisma.boquettes.findFirst({where:{id_boquette}});
  if(!boquette || boquette.id_zident != locals.session.data.user?.pg.id_pg) throw error(400);


  const appartenance_boquettes = await prisma.appartenance_boquettes.findMany({
    where: {
      id_boquette
    },
    include: {pg:true}
  })

  return {
    appartenance_boquettes
  }
};


export const actions = {
  ajouter_membre: async ({params, locals, request}) => {
    const id_boquette = parseInt(params.id_boquette);
    if (isNaN(id_boquette)) return fail(400);

    const d = Object.fromEntries(await request.formData());
    const data = AjouterMembreSchema.safeParse(d);
    if (!data.success) throw error(400);

    const pg = await prisma.pg.findFirst({
      where: { nums:data.data.nums, proms:data.data.proms }
      }
    )
    if(!pg) return fail(400);

    await prisma.appartenance_boquettes.create({
      data: {
        id_boquette,
        id_pg: pg.id_pg
      }
    });
  },
  supprimer_membre: async ({params, request}) => {
    const id_boquette = parseInt(params.id_boquette);
    if (isNaN(id_boquette)) return fail(400);

    const d = Object.fromEntries(await request.formData());
    const data = z.object({
      id_appartenance_boquette:z.string().transform(e=>parseInt(e)).refine(e=>!isNaN(e))
    }).safeParse(d);

    if (!data.success) throw error(400);
    console.log(data);

    await prisma.appartenance_boquettes.delete({
      where: {id: data.data.id_appartenance_boquette}
    });
  },
}