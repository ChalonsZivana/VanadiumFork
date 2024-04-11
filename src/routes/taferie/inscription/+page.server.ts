import type { RequestEvent } from './$types.js';
import prisma from '$lib/prisma.js';
import { fail } from '@sveltejs/kit';
import { InscriptionSchema } from '$lib/zodSchema.js';

export const actions = {
  inscription: async ({ request }:RequestEvent) => {
    const d = Object.fromEntries(await request.formData())
    const data = InscriptionSchema.safeParse(d);
    if(!data.success) throw fail(400, data.error.format());
    
    const user = await prisma.pg.findFirst({where:{nums:data.data.nums, proms:data.data.proms}})
    if(user) return fail(400, {'already exists':true, solde:data.data.solde, proms:data.data.proms})
      await prisma.pg.create({
      data:{
        ...data.data,
        tabagns:"Ch",
        bucque:"SQRT"
      }
    });
    return { success:true, solde:data.data.solde, proms:data.data.proms }
  }
}