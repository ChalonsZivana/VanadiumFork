import { error } from '@sveltejs/kit';

export function GET({request, url}){
  const verify_token = url.searchParams.get('hub.verify_token');
  if(verify_token !== "myverifytoken") return error(400)
  // url.searchParams.get('hub.mode')
  
  return new Response(url.searchParams.get('hub.challenge'))
}