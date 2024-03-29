import { getFams, getUser } from "./db_connection";
import type {pg, fams, boquettes} from "@prisma/client";
import { createHash } from 'crypto';

export interface User {
  pg:pg,
	fams:fams,
}

export type SessionData = {
	user: User | null;
	boquettes: boquettes[];
};

export async function createUser(id_pg:number):Promise<User|null>{
	const user = await getUser(id_pg);
	if(user == null) return null;
	const fams = await getFams(user.nums);
	if(fams == null) return null;

	return {
		pg:user, 
		fams:fams,
	} as {pg:pg, fams:fams};//2507:Skou , 2479:Peynetre	
}

export async function updateUser(locals:App.Locals){
	await locals.session.update(async(d) => {
		if(!d.user) return d;
		d.user = await createUser(d.user.pg.id_pg);
		return d;
	})
}

export const hashPassword = (password:string) => {
	let pswd =  createHash('sha1');
	pswd.update(password);
	return pswd.digest('hex');
}