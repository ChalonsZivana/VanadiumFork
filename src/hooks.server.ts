import { redirect } from "@sveltejs/kit"
import { handleSession,  } from 'svelte-kit-cookie-session';
import {SESSION_TOKEN} from "$env/static/private";


export const handle = handleSession(
  {
    secret:SESSION_TOKEN,
    expires:30,
    expires_in:"days"
  },
  async ({event, resolve})=>{
    switch(true){
      case event.route.id?.startsWith('/(user)'):
        if(event.locals.session.data.user == undefined) throw redirect(303,"/login");
        break;
      case event.route.id?.startsWith('/(boquette)'):
        if(event.locals.session.data.boquettes == undefined) throw redirect(303,"/login");
        break;
      case event.route.id?.startsWith('/(fast access)'):
        break;
    }
    return resolve(event);
  }
)