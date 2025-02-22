import prisma from "$lib/prisma.js";
import { error } from "@sveltejs/kit";
import { z } from "zod";


const fromage = z.enum(['tomme noir','morbier','raclette']);
const saucisson = z.enum([
  'pur porc','noix','noisettte/noix','beaufort','canard','cèpes','sec','provençal','sanglier','bleu','piment','chorizo',
  'halal-chorizo','halal-olive','halal-nature'
]);
const taille = z.enum(['demi-croüte','croüte','maxi-croüte']);
const schema = z.object({
  fromage, 
  saucissons:z.string().transform(e => e.split('>')).pipe(z.array(saucisson)), 
  taille,
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
    console.log(data)
    const validated = schema.safeParse(data);
    console.log(validated)
    if (!validated.success) throw error(400, "Données invalides");

    await prisma.commandes.create({
      data: {
        type: "pg_boq",
        from: locals.session.data.user.pg.id_pg,
        to: 3,
        libelle: `${validated.data.taille} ${validated.data.fromage} ${validated.data.saucissons.join(' > ')} ${validated.data.vege ? 'vege' : ''}`,
      },
    });
    return {success:true, message: "Commande enregistrée"};
  }
};
