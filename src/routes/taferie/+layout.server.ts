import prisma from '$lib/prisma.js';

export const load = async ({locals})=>{
  return {
    config:{
      lydiazocque:await prisma.config.findFirst({where:{nom:'lydiazocque'}}),
      vanazocque:await prisma.config.findFirst({where:{nom:'vanazocque'}})
    },
    USER:locals.session.data.user,
    BOQUETTES:locals.session.data.boquettes
  };
}