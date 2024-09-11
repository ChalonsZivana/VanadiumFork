import { Pg } from '$lib/server/classes/PG.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
  if(locals.session.data.user == null) throw redirect(300, "/login");

  const pg = new Pg(locals.session.data.user.pg.id_pg);
  await pg.incrementRefresh();

  return {
    USER:locals.session.data.user,
    BOQUETTES:locals.session.data.boquettes,
    url:url.pathname
  }
}