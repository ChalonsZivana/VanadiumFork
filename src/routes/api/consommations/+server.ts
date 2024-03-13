import prisma from "$lib/prisma";
import { Pg } from "$lib/server/classes/PG";
import { error } from "@sveltejs/kit"

export async function POST({request}) {
  const {action,id} = JSON.parse(await request.text())

  if (!action || !id) throw error(400);
  
  const id_conso = parseInt(id)
  if(isNaN(id)) throw error(400, 'Invalid id');

  const cons = await prisma.consommations.findFirst({
    where:{id_conso:id_conso}
  });
  if(cons == null || cons.id_pg==null) throw error(400, 'Invalid id');
  const pg = await Pg.new(cons.id_pg);

  switch(action){
    case 'cancel':
      await prisma.consommations.update({
        where:{id_conso:id_conso},
        data:{annule:true}
      });
      break;
    case 'uncancel':
      await prisma.consommations.update({
        where:{id_conso:id},
        data:{annule:null}
      });
      break;
    default:
      throw error(400,'Invalid action');
  }

  return new Response(JSON.stringify({success:true}))
}
