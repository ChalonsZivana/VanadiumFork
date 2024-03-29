import { Prisma } from '@prisma/client';
import type { RequestEvent } from './$types.js';
import prisma from '$lib/prisma.js';
import { fail } from '@sveltejs/kit';

export const actions = {
  inscription: async ({ request }:RequestEvent) => {
    const data = await request.formData()
    const email = data.get('email')?.toString()??'';
    const nums = parseInt(data.get('nums')?.toString()??'');
    const proms = parseInt(data.get('proms')?.toString()??'');
    const prenom = data.get('prenom')?.toString()??'';
    const nom = data.get('nom')?.toString()??'';
    const solde = parseInt(data.get('solde')?.toString()??'');
    console.log(email)
    if(isNaN(nums) || isNaN(proms) || isNaN(solde) || prenom=='' || nom=='' || email==''){
			return fail(400, { missing: true });
    }
    
    const user = await prisma.pg.findFirst({where:{nums, proms}})
    if(user) return fail(400, {'already exists':true})

    await prisma.pg.create({
      data:{
        email:email,
        nums:nums,
        prenom:prenom,
        nom:nom,
        proms:proms,
        solde:solde,
        tabagns:"Ch",
        bucque:"SQRT"
      }
    });
    return { success:true }
  }
}