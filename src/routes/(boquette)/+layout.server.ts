import type { LayoutServerLoad } from "./$types.js";

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    USER: locals.session.data.user,
    BOQUETTES: locals.session.data.boquettes,
  };
};
