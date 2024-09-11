import fs from 'fs';
import { redirect } from "@sveltejs/kit";
import { Pg } from '$lib/server/classes/PG.js';
import { getRandomTop, getTop } from '$lib/server/db_connection.js';
import { Database } from '$lib/server/classes/Database.js';
import { Taferie } from '$lib/server/classes/Taferie.js';


export const load = async ({ locals }) => {
  if(!locals.session.data.user) throw redirect(300, "/login");

  const pg = new Pg(locals.session.data.user.pg.id_pg);
  await pg.incrementRefresh();

  const topGlobal = getTop("Top Global", null);
  const topDuJour = getRandomTop()
  const photosFolder = await pg.getPhotosFolder();


  return {
    photos:Array(10).fill(0).map((_)=>getRandomPhoto(photosFolder)),
    negats:await Database.negatsProms([222,223]),
    topGlobal,
    topDuJour,
    consommations: Taferie.consommations([
      {type:'pg_boq', from:pg.ID},
      {type:'pg_pg', from:pg.ID},
      {type:'pg_fams', from:pg.ID},
      {type:'pg_ext', from:pg.ID},
    ])
  }
}


function getRandomPhoto(folder:string){
	const folderPath = './static/photos/' + folder;

	const files = fs.readdirSync(folderPath);
	const randomFile = files[Math.floor(Math.random() * files.length)];

  return `/photos/${folder}/${randomFile}`;
}