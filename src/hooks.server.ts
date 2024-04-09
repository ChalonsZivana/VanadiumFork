import { error, redirect } from "@sveltejs/kit"
import { handleSession,  } from 'svelte-kit-cookie-session';
import {SESSION_TOKEN} from "$env/static/private";
import { createUser } from "$lib/server/auth";
import { Boquette } from "$lib/server/classes/Boquette";


export const handle = handleSession(
  {
    secret:SESSION_TOKEN,
    expires:30,
    expires_in:"days",
  },
  async ({event, resolve})=>{
    const routeId = event.route.id;
    if(!routeId) throw error(404);

    if(routeId.startsWith("/login")) return resolve(event);
    
    if(routeId.startsWith('/(user)')){
      // check the connexion of the user
      const user = event.locals.session.data.user;
      if(user) {
        await event.locals.session.update(async (d)=>{
          d.user = await createUser(user.pg.id_pg);
          return d;
        });
        return resolve(event);
      }
      if(event.locals.session.data.boquettes != undefined && event.locals.session.data.boquettes.length != 0){
        const boq = event.locals.session.data.boquettes[0];
        if(boq.id_boquette == 20){
          throw redirect(303, "/taferie");
        } else {
          throw redirect(303, `boquette-${boq.id_boquette}`);
        }
      } else {
        throw redirect(303, "/login");
      }
    } 
    
    
    if(event.locals.session.data.boquettes == undefined) throw redirect(303, "/login");
    const boquettes = event.locals.session.data.boquettes;

    let id_boquette = 20;
    if(event.route.id?.startsWith('/taferie')) {
      if(!boquettes.map(e=>e.id_boquette).includes(id_boquette)) throw redirect(303,"/login");
    }

    if(routeId.startsWith('/(boquette)')){
      const regex = /\(boquette\)\/boquette-(\d+)/;
      id_boquette = parseInt(event.params['id_boquette']??'');
      if(isNaN(id_boquette)) id_boquette = parseInt(event.route.id?.match(regex)?.at(1)??'');
      if(isNaN(id_boquette)) throw error(404);
      if(!boquettes.map(e=>e.id_boquette).includes(id_boquette)) {
        // taferie: 20, la taferie a accès à tout
        if(!boquettes.map(e=>e.id_boquette).includes(20)) throw redirect(303,"/login");
      }
    } else if(routeId.startsWith('/(fast access)')){

    }
    await event.locals.session.update(async (d)=>{
      const newBoquette = await new Boquette(id_boquette).boquette();
      d.boquettes = d.boquettes.map(e => e.id_boquette == id_boquette ? newBoquette : e);
      return d;
    });
    
    
    return resolve(event);
  }
)

