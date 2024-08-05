import fs from 'fs';
import { redirect } from "@sveltejs/kit";


export const load = async ({ locals }) => {
  if(!locals.session.data.user) throw redirect(300, "/login");

  redirect(300, "/test");

  // const pg = new Pg(locals.session.data.user.pg.id_pg);
  // await pg.incrementRefresh();

  // const topGlobal = getTop("Top Global", null);
  // const topDuJour = getRandomTop()

  // return {
  //   photo: getRandomPhoto(await pg.getPhotosFolder()),
  //   negats:await Database.negatsProms([222,223]),
  //   topGlobal,
  //   topDuJour,
  //   consommations: Taferie.consommations([
  //     {type:'pg_boq', from:pg.ID},
  //     {type:'pg_pg', from:pg.ID},
  //     {type:'pg_fams', from:pg.ID},
  //     {type:'pg_ext', from:pg.ID},
  //   ])
  // }
}


function getRandomPhoto(folder:string){
	const folderPath = './static/photos/' + folder;

	const files = fs.readdirSync(folderPath);
	const randomFile = files[Math.floor(Math.random() * files.length)];
	
	return `/photos/${folder}/${randomFile}`;
}