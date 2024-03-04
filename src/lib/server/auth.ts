import type { RequestEvent } from "@sveltejs/kit"
import { getFams, getUser } from "./db_connection";
import type {pg, fams, remember, boquettes} from "@prisma/client";
import prisma from "$lib/prisma";
import { createHash } from 'crypto';

export interface User {
  pg:pg,
	fams:fams,
}

export type SessionData = {
	user: User;
	boquettes: boquettes[];
};

export const authenticateUser = async(event: RequestEvent):Promise<User|null> => {
	// get the user token from the cookie
	const cookies = event.cookies;
	const code = cookies.get("auth")?.toString();
	
	if(code == null) return null;
	const remember = await prisma.remember.findFirst({where:{code:code}})
	if(remember == null) return null;

	return createUser(remember.id_pg);
}


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

export const logInUser = async(event: RequestEvent):Promise<User|null> => {
		// get the user token from the cookie
		const cookies = event.cookies;
		const userToken = parseInt(cookies.get("auth")?.toString()??"")
		
		if(isNaN(userToken)) return null;
		const user = await getUser(userToken);
		if(user == null) return null;
		const fams = await getFams(user.nums);
		if(fams == null) return null;
	
		if(userToken){
			return {
				pg:user, 
				fams:fams,
			} as {pg:pg, fams:fams};//2507:Skou , 2479:Peynetre
		}
		return null
}


export const hashPassword = (password:string) => {
	let pswd =  createHash('sha1');
	pswd.update(password);
	return pswd.digest('hex');
}

export const tryBoquette = async(nom_simple:string) => {
	const boqss = await prisma.boquettes.findFirst({where:{nom_simple:nom_simple},select:{nom_simple:true, mot_de_passe:true, id_boquette:true}})

}