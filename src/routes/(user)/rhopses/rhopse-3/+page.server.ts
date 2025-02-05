import prisma from "$lib/prisma.js";
import { error } from "@sveltejs/kit";
import { z } from "zod";


const fromage = z.enum(['tome noir','morbier','raclette']);
const saucisson = z.enum(['pur porc','noix','sanglier']);
const taille = z.enum(['croüte','demi-croüte','maxi-croüte']);
const schema = z.object({
  fromage, saucisson, taille,
  vege: z.string().transform(e => e=='true')
});

export const load = async ({ params }) => {
  return { 
    id_boquette: 3, 
    fromages: fromage.options, 
    saucissons:saucisson.options, 
    tailles:taille.options 
  };
};

export const actions = {
  commanderCroute: async ({ request, locals }) => {
    if(!locals.session.data.user) throw error(401, "Non connecté");
    const data = Object.fromEntries(await request.formData());
    const validated = schema.safeParse(data);

    if (!validated.success) throw error(400, "Données invalides");

    await prisma.commandes.create({
      data: {
        type: "pg_boq",
        from: locals.session.data.user.pg.id_pg,
        to: 3,
        libelle: `${validated.data.taille} ${validated.data.fromage} ${validated.data.saucisson} ${validated.data.vege ? 'vege' : ''}`,
      },
    });
    console.log(data,validated)
    return {success:true, message: "Commande enregistrée"};
  }
};
