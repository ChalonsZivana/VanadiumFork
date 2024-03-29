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
      const user = event.locals.session.data.user;
      if(user == undefined) throw redirect(303,"/login");
      await event.locals.session.update(async (d)=>{
        d.user = await createUser(user.pg.id_pg);
        return d;
      });
    } else if(event.route.id?.startsWith('/(boquette)')) {
      if(event.locals.session.data.boquettes == undefined || !('id_boquette' in event.params)) throw redirect(303,"/login");
      const id_boquette = parseInt(event.params['id_boquette']??'');
      if(!event.locals.session.data.boquettes.map(e=>e.id_boquette).includes(id_boquette)) throw redirect(303,"/login");
      // await event.locals.session.update(async (d)=>{
      //   const newBoquettes:boquettes[] = [];
      //   d.boquettes.forEach(async (e) => {
      //     const nb = await new Boquette(e.id_boquette).boquette()
      //     newBoquettes.push(nb);
      //   });
      //   d.boquettes = newBoquettes;
      //   return d;
      // });
    } else if(event.route.id?.startsWith('/taferie')) {
      if(event.locals.session.data.boquettes == undefined) throw redirect(303,"/login");
      const id_boquette = 20;
      if(!event.locals.session.data.boquettes.map(e=>e.id_boquette).includes(id_boquette)) throw redirect(303,"/login");
    } else if(event.route.id?.startsWith('/(fast access)')){

    }
    return resolve(event);
  }
)