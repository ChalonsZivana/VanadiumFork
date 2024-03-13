import prisma from "$lib/prisma";
import { error } from "@sveltejs/kit"

export async function POST({request}) {
  const {action,id} = JSON.parse(await request.text())

  if (!action || !id) throw error(400);
  

  const id_transaction = parseInt(id)
  if(isNaN(id)) throw error(400, 'Invalid id');

  switch(action){
    case 'cancel':
      await prisma.historique_fams.update({
        where:{id_transaction:id_transaction},
        data:{annule:1}
      })
      break;
    case 'uncancel':
      await prisma.historique_fams.update({
        where:{id_transaction:id_transaction},
        data:{annule:null}
      })
      break;
    default:
      throw error(400,'Invalid action');
  }

  return new Response(JSON.stringify({success:true}))
}