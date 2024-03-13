import fs from 'fs';
import type { PageServerLoad } from "./$types"
import { Database } from "$lib/server/classes/Database";
import { redirect } from "@sveltejs/kit";
import { Pg } from "$lib/server/classes/PG";


export const load: PageServerLoad = async ({ locals }) => {
  if(locals.session.data.user == null) throw redirect(300, "/login");

  const pg = new Pg(locals.session.data.user.pg);
  await pg.incrementRefresh();

  return {
    photo: getRandomPhoto(await pg.getPhotosFolder()),
    negats:await Database.negatsProms([222,223])
  }
}

function getRandomPhoto(folder:string){
	const folderPath = './static/photos/' + folder;

	const files = fs.readdirSync(folderPath);
	const randomFile = files[Math.floor(Math.random() * files.length)];
	
	return `/photos/${folder}/${randomFile}`;
}