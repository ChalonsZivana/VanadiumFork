export const load = async ({locals})=>{
  return {
    USER:locals.session.data.user,
    BOQUETTES:locals.session.data.boquettes
  };
}