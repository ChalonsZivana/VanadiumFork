import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  if(locals.session.data.user == null) throw redirect(300, "/login");

  return {
    USER:locals.session.data.user,
    BOQUETTES:locals.session.data.boquettes
  }
}