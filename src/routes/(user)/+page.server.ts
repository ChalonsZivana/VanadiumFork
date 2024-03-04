import prisma from "$lib/prisma";
import fs from 'fs';
import type { PageServerLoad } from "./$types"


export const load: PageServerLoad = async ({ locals }) => {
  // manage refresh count
	const refresh = await prisma.refresh.findFirst(
    {where:{id_pg:locals.session.data.user.pg.id_pg}}
  );
  
  if(refresh != null){
    await prisma.refresh.updateMany(
      {where:{id_pg:locals.session.data.user.pg.id_pg}, data:{nombre:refresh?.nombre + 1}}
    );
  }

  // charge le gif
  let folder = "paysage";
	if( locals.session.data.user != null){
		const photo = await prisma.photos.findFirst({where:{id_pg:locals.session.data.user.pg.id_pg}});
		folder = (locals.session.data.user.pg.solde >= 0) ? (photo?.nom??folder): 'moche'
	}
  return {
    photo:getRandomPhoto(folder),
  }
}

function getRandomPhoto(folder:string){
	const folderPath = './static/photos/' + folder;

	const files = fs.readdirSync(folderPath);
	const randomFile = files[Math.floor(Math.random() * files.length)];
	
	return `/photos/${folder}/${randomFile}`;
}