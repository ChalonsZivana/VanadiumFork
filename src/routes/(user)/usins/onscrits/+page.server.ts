import prisma from '$lib/prisma.js'
import { BOQUETTES } from '$lib/server/classes/Boquette.js'
import { error } from '@sveltejs/kit'
import zod from 'zod'


export const actions = {
  fourchette:async ({request, locals})=>{
    if(!locals.session.data.user) throw error(400);
    const data = Object.fromEntries(await request.formData());
    const result = zod.object({nums:zod.string().transform(e => parseInt(e)).refine(e => !isNaN(e))}).safeParse(data)
    if(!result.success) throw error(400);

    const currentDate = new Date().toLocaleDateString('fr-FR');


    const onscrit = await prisma.$queryRaw`
      SELECT data->${currentDate}->'f' AS f
      FROM suivi_onscrits
      WHERE nums = ${result.data.nums};
    ` as {'f':number[] |null}[];

    if(onscrit.length == 0) throw error(400);
    const fourchettages = onscrit[0].f ?? [];
    if(!fourchettages.includes(locals.session.data.user.pg.nums)){
      fourchettages.push(locals.session.data.user.pg.nums);
    }


    await prisma.$executeRaw`
      UPDATE suivi_onscrits
      SET data = jsonb_set(data, ${[currentDate]}::text[], ${JSON.stringify({'f':fourchettages})}::jsonb, true)
      WHERE nums = ${result.data.nums}
      `;

    return {
      onscrit: await prisma.suivi_onscrits.findFirst({where:{nums:result.data.nums}})
    }
  },
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
    }).safeParse(data);
    console.log(data)
    console.log(result.data)
    if(result.data == null) throw error(400, "invalid data");

    await prisma.$executeRaw`
      UPDATE suivi_onscrits
      SET data = jsonb_set(data, ${[currentDate]}::text[], ${JSON.stringify({'f':fourchettages})}::jsonb, true)
      WHERE nums = ${result.data.nums}
      `;
    
    if(!result.success) throw error(400);

    await prisma.suivi_onscrits.update({where:{nums:result.data.nums}, data:{data:JSON.stringify(result.data.data)}});
    return {
      onscrit: await prisma.suivi_onscrits.findFirst({where:{nums:result.data.nums}})
    }
  },

}