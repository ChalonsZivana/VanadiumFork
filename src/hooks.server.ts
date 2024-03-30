import { redirect } from "@sveltejs/kit"
import { handleSession,  } from 'svelte-kit-cookie-session';
import {SESSION_TOKEN} from "$env/static/private";
import { createUser } from "$lib/server/auth";
import { Boquette } from "$lib/server/classes/Boquette";
import type { boquettes } from "@prisma/client";


export const handle = handleSession(
  {
    secret:SESSION_TOKEN,
    expires:30,
    expires_in:"days"
  },
  async ({event, resolve})=>{

    if(event.route.id?.startsWith('/(user)')){
      // check the connexion of the user
      const user = event.locals.session.data.user;
      if(user == undefined) throw redirect(303,"/login");
      await event.locals.session.update(async (d)=>{
        d.user = await createUser(user.pg.id_pg);
        return d;
      });
    } 

    if(event.locals.session.data.boquettes == undefined) throw redirect(303, "/login");
    const boquettes = event.locals.session.data.boquettes;

    if(event.route.id?.startsWith('/(boquette)')) {
      const id_boquette = parseInt(event.params['id_boquette']!);
      if(!boquettes.map(e=>e.id_boquette).includes(id_boquette)) {
        // taferie: 20, la taferie a accès à tout
        if(!boquettes.map(e=>e.id_boquette).includes(20)) throw redirect(303,"/login");
      }
      await event.locals.session.update(async (d)=>{
        const newBoquette = await new Boquette(id_boquette).boquette();
        d.boquettes = d.boquettes.map(e => e.id_boquette == id_boquette ? newBoquette : e);
        return d;
      });
    } else if(event.route.id?.startsWith('/taferie')) {
      const id_boquette = 20;
      if(!boquettes.map(e=>e.id_boquette).includes(id_boquette)) throw redirect(303,"/login");
    } else if(event.route.id?.startsWith('/(fast access)')){

    }
    return resolve(event);
  }
)