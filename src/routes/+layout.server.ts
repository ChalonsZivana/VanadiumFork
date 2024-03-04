import type { LayoutServerLoad } from "./$types";

export const load:LayoutServerLoad = async ({url, locals})=>{
  let id_boquette = parseInt(url.searchParams.get('id_boquette')??'');
  if(url.pathname.startsWith('/tafferie')) id_boquette = 20;
  return { session:locals.session.data, id_boquette };
}