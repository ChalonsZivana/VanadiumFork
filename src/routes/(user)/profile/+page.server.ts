import prisma from "$lib/prisma";
import { hashPassword } from "$lib/server/auth";
import type { PageServerLoad } from "../$types";
import { type RequestEvent, error, fail } from "@sveltejs/kit";
import { oneSignalClient, ONESIGNAL_APP_ID } from "$lib/server/onesignal";
import { z } from "zod";

export const load:PageServerLoad  = async ({locals})=>{
  const photos = await prisma.photos.findFirst(
    {where:{id_pg:locals.session.data.user?.pg.id_pg}}
  );

  return {
    photosFolder:photos?.nom
  }
}

export const actions = {
  change_password: async ({ request, locals }:RequestEvent) => {
    const data = await request.formData();
    const password = data.get('P')?.toString();
    const newPassword = data.get('NP')?.toString();
    const repeatPassword = data.get('RP')?.toString();

    if(password == null || newPassword == null || repeatPassword == null){
      return fail(400, {missing:true})
    }

    if(newPassword !== repeatPassword){
      return fail(400, {different:true})
    }
    const encodedPassword = hashPassword(password);
    if(encodedPassword !== locals.session.data.user?.pg.mot_de_passe){
      return fail(400, {wrong:true});
    }
    await prisma.pg.update({where:{id_pg:locals.session.data.user.pg.id_pg}, data:{mot_de_passe:hashPassword(newPassword)}});
  },
  create_user: async({locals})=>{
    const pg = locals.session.data.user?.pg;
    if(!pg) return {}
    const r = await oneSignalClient.createUser(ONESIGNAL_APP_ID, {identity:{id_pg:pg.id_pg.toString()}});
    //oneSignalClient.createSubscription(ONESIGNAL_APP_ID, 'id_pg', pg.id_pg.toString())
  },
  ajouter_ancien: async({locals, request}) =>{
    const data = Object.fromEntries(await request.formData());
    const result = z.object(
      {
        nums:z.string().transform(e => parseInt(e)), 
        proms:z.string().transform(e => parseInt(e))
      }).refine(e => !isNaN(e.nums) && !isNaN(e.proms)).safeParse(data);

    if(!result.success) throw error(400);

    await prisma.pg.update({data:{anciens_autorises:{push:`${result.data.nums}ch${result.data.proms}`}}, where:{id_pg:locals.session.data.user?.pg.id_pg}})
  },
  retirer_ancien: async ({ locals, request }) => {
    const data = Object.fromEntries(await request.formData());
    const result = z.object(
      {
        ancien: z.string(),
      }).safeParse(data);
  
    if (!result.success) throw error(400);


    // Fetch the current anciens_autorises array
    const pg = await prisma.pg.findUnique({
      where: { id_pg: locals.session.data.user?.pg.id_pg },
      select: { anciens_autorises: true }
    });
  
    if (!pg) throw error(404, 'PG not found');
      
    // Filter the anciens_autorises array to remove the specified entry
    const updatedAnciens = pg.anciens_autorises.filter(item => item !== result.data.ancien);
  
    // Update the array in the database
    await prisma.pg.update({
      where: { id_pg: locals.session.data.user?.pg.id_pg },
      data: { anciens_autorises: updatedAnciens }
    });
  },
  
}