import { redirect } from "@sveltejs/kit"
import { handleSession,  } from 'svelte-kit-cookie-session';
import {SESSION_TOKEN} from "$env/static/private";
import { createUser } from "$lib/server/auth";


export const handle = handleSession(
  {
    secret:SESSION_TOKEN,
    expires:30,
    expires_in:"minutes",
  },
  async ({event, resolve})=>{
    switch(true){
      case event.route.id?.startsWith('/(user)'):
        break;
      case event.route.id?.startsWith('/(boquette)'):
        break;
      case event.route.id?.startsWith('/(fast access)'):
        break;
    }
    
    if(event.locals.session.data.user == undefined && event.url.pathname !== '/login'){
      throw redirect(303,"/login");
    } else if(event.locals.session.data.user != undefined){
      const userUpdated = await createUser(event.locals.session.data.user.pg.id_pg);
      if(userUpdated != null) event.locals.session.data.user =  userUpdated;
    }
    console.log(Date.now())

    console.log("expires",event.locals.session.expires?.toLocaleString())
    if(event.locals.session.expires != undefined){
      
    }
    
    return resolve(event);
  }
  
)

export const before =()=>{

}
