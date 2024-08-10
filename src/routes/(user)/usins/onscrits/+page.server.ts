import prisma from '$lib/prisma.js'
import { BOQUETTES } from '$lib/server/classes/Boquette.js'
import { error } from '@sveltejs/kit'
import zod from 'zod'


export const actions = {
  get_onscrit:async ({request})=>{
    const data = Object.fromEntries(await request.formData());
    const result = zod.object({nums:zod.string().transform(e => parseInt(e)).refine(e => !isNaN(e))}).safeParse(data)
    if(!result.success) throw error(400);

    return {
      onscrit: await prisma.suivi_onscrits.findFirst({where:{nums:result.data.nums}})
    }
  },
  set_onscrit:async ({request, locals})=>{
    if(locals.session.data.boquettes.find(e => e.id_boquette == BOQUETTES["Ser'C"]) === undefined){
      throw error(400, "unhautorized")
    }
    const data = Object.fromEntries(await request.formData())

    const result = zod.object({
      nums:zod.string().transform(e => parseInt(e)).refine(e => !isNaN(e)), 
      data:zod.string().transform(
        e => JSON.parse(e)
      ).refine(e => zod.array(
        zod.object({date:zod.string(), comments:zod.string()})
      ).safeParse(e).success)
    }).safeParse(data)

    if(!result.success) throw error(400);

    await prisma.suivi_onscrits.update({where:{nums:result.data.nums}, data:{data:JSON.stringify(result.data.data)}});
    return {
      success:true
    }
  },

}