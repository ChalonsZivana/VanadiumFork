import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load:PageServerLoad  = async ({locals, parent})=>{
  const proms = locals.session.data.user?.pg.proms;

  if(proms != 223) throw redirect(303, "/");
  return {}
}