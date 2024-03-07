
import { error } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load:PageServerLoad = async ({params, url})=>{
  const nums = parseInt(params.nums);
  if(isNaN(nums))throw error(404, 'Fams missing');
  const fams = await prisma.fams.findFirst({where:{nums}})
  if(fams == null)throw error(404, 'Fams missing');

  const historique_fams = await prisma.historique_fams.findMany({where:{fams:nums}, orderBy:{date_transaction:'desc'}});
  return {
   fams, historique_fams
  };
}