import prisma from "$lib/prisma";
import type { RequestHandler } from "@sveltejs/kit"

export const POST:RequestHandler = async({request,locals}) => {
  const folder = await request.json().catch();
  const dossiersGifs = {
    "gifs filles":"gif",
    "gifs garçons":"gifF",
    "gifs mixte":"gifHF",
    "photos animaux":"animaux",
    "photos filles":"jolie",
    "photos garçons":"jolieF",
    "photos motos":"moto",
    "photos paysage":"paysage",
    "photos voitures":"voiture"
  }

  if(Object.values(dossiersGifs).includes(folder)){
    await prisma.photos.updateMany(
      {where:{id_pg:locals.session.data.user.pg.id_pg}, data:{nom:folder}}
    );
  }
  
  return new Response('');
}
