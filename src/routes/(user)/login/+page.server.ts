import type { RequestEvent } from '@sveltejs/kit';
import { redirect,fail } from '@sveltejs/kit';
import { getUserPassword } from '$lib/server/db_connection.js';
import prisma from '$lib/prisma.js';
import { createUser, hashPassword } from '$lib/server/auth.js';

export const actions = {
  login: async ({ request, locals }:RequestEvent) => {
		const data = await request.formData();
		const uid = data.get('id')?.toString().toLowerCase();
		const password = data.get('password')?.toString();
		const remember = data.get('remember')?.toString();

		if(!uid || !password){
			return fail(400, { uid, missing: true });
		}
		
		const boquettes_noms_simples = await prisma.boquettes.findMany({select:{nom_simple:true, mot_de_passe:true}})

		const boq = boquettes_noms_simples.find(e=>e.nom_simple==uid);
		const encodedPswd = hashPassword(password);
		if (boq !== undefined) {
			if(boq.mot_de_passe !== encodedPswd){
				return fail(400, { uid, wrong: true });
			}			
		} else if(uid.includes('ch')){
			console.log('login', boq)

			const [nums,proms] = uid.toLowerCase().split('ch') as string[];
			const userPswd = await getUserPassword(parseInt(nums), parseInt(proms));
			if (!userPswd) {
				return fail(400, { nums, proms, missing: true });
			}

			if(userPswd?.mot_de_passe !== encodedPswd){
				return fail(400, { nums, proms, wrong: true });
			}

			const user = await createUser(userPswd.id_pg);

			if(user == null) return {}
			
			await locals.session.update(
				(e) =>{
					return {user:user};
				}
			);

			if(remember == 'on'){
				locals.session.expires?.setMonth(1);
			}
		} else {
			return fail(400, {uid, wrong:true});
		}

		redirect(303, "/");
	},
	logout:async ({ locals }:RequestEvent) => {
		await locals.session.destroy();
	}
}

function makeid(length:number) {
	let result = '';
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}