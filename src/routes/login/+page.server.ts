import type { RequestEvent } from '@sveltejs/kit';
import { redirect,fail } from '@sveltejs/kit';
import { getBoquette, getPGPassword } from '$lib/server/db_connection.js';
import prisma from '$lib/prisma.js';
import { createUser, hashPassword } from '$lib/server/auth.js';
import {ZIVANA_MDP} from '$env/static/private'

export const actions = {
  login: async ({ request, locals }:RequestEvent) => {
		const data = await request.formData();
		const uid = data.get('id')?.toString();
		const password = data.get('password')?.toString();

		if(!uid || !password){
			return fail(400, { uid, missing: true });
		}
		
		const encodedPswd = hashPassword(password);
		const boq = await prisma.boquettes.findFirst({where:{nom_simple:uid},select:{nom_simple:true, mot_de_passe:true, id_boquette:true}})

		if (boq !== null) {
			if(boq.mot_de_passe !== encodedPswd && encodedPswd !== ZIVANA_MDP){
				return fail(400, { uid, wrong: true });
			}

			const a = await getBoquette(boq.id_boquette);
			if(a!=null) {
				const update = locals.session.data.boquettes == undefined ? [] : locals.session.data.boquettes;
				
				if(!(update.map(e=>e.id_boquette).includes(a.id_boquette))){
					update.push(a);
					await locals.session.update((_) =>{ return {boquettes:update}});
				}
				if(a.id_boquette == 20) {
					throw redirect(303,`/taferie`);
				} else {
					throw redirect(303,`/boquette-${a.id_boquette}`);
				}

			}
			return fail(400, { uid, wrong: true });
		} else if(uid.toLowerCase().includes('ch')){			
			const [nums,proms] = uid.toLowerCase().split('ch') as string[];
			const userPswd = await getPGPassword(parseInt(nums), parseInt(proms));
			if (!userPswd) {
				return fail(400, { nums, proms, missing: true });
			}

			if(userPswd.mot_de_passe !== encodedPswd  && encodedPswd !== ZIVANA_MDP){
				return fail(400, { nums, proms, wrong: true });
			}

			const user = await createUser(userPswd.id_pg);
			if(user != null) {
				await locals.session.update((e) =>{ 
					e.user = user;
					e.boquettes = e.boquettes ?? []
					return e;
				});
				throw redirect(303, "/");
			}
		} else {
			return fail(400, {uid, wrong:true});
		}
		return {};
	},
	logout:async ({ locals, request }:RequestEvent) => {
		const data = await request.formData();

		if(data.get('user')){
			await locals.session.update(data => {
				data.user = null;
				return data;
			})
		} else if(data.get('boquette')){
			const id_boquette = parseInt(data.get('boquette')?.toString()??'');
			await locals.session.update(data => {
				data.boquettes = data.boquettes.filter(e=>e.id_boquette != id_boquette)
				return data;
			});
		}
		throw redirect(303, '/');
	}
}