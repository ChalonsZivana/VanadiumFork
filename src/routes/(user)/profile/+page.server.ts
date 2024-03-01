import prisma from "$lib/prisma";
import { hashPassword } from "$lib/server/auth";
import type { PageServerLoad } from "../$types";
import { type RequestEvent, fail } from "@sveltejs/kit";

export const load:PageServerLoad  = async ({locals})=>{
  const photos = await prisma.photos.findFirst(
    {where:{id_pg:locals.session.data.user.pg.id_pg}}
  );

  return {
    photosFolder:photos?.nom
  }
}

export const actions = {
  change_password: async ({ request, locals }:RequestEvent) => {
    console.log(locals.session.data.user.pg.id_pg)
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
    if(encodedPassword !== locals.session.data.user.pg.mot_de_passe){
      return fail(400, {wrong:true});
    }
    await prisma.pg.update({where:{id_pg:locals.session.data.user.pg.id_pg}, data:{mot_de_passe:hashPassword(newPassword)}});
  }
}