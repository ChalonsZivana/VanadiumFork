import prisma from '$lib/prisma';
import { RhopseSchema } from '$lib/zodSchema.js';
import { error, fail } from '@sveltejs/kit';
import Twilio from 'twilio';


const accountSid = 'AC926d01b1dace4d670f34b2a617cf32d1';
const authToken = '92869824d3229f990e7da757f855da21';
const client = new Twilio.Twilio(accountSid, authToken)

export async function load({params}){
  const numero_table = parseInt(params.numero_table);
  if(isNaN(numero_table)) throw error(404);


  let categories = await prisma.categories.findMany({where:{id_boquette:223}, orderBy:{nom:'asc'}});
  let produits = await prisma.produits.findMany({where:{id_boquette:223}, orderBy:{nom:'asc'}});
  return { 
    produits,categories, numero_table
  };
}

export const actions = {
  commande:async({request, params})=>{
    const numero_table = parseInt(params.numero_table);
    if(isNaN(numero_table)) throw error(404);

    const t = Object.fromEntries(await request.formData());
    const parse = RhopseSchema.safeParse(t);

    if(!parse.success) return fail(400,{});
    const data = parse.data;

    const produits = await Promise.all(data.produits.map(async e => prisma.produits.findFirst({where:{id_produit:e[0]}})));
    if(!produits.every(e => e !== null)) return {success:false};

    for(let prod of produits){
      await prisma.commandes.create({
        data:{
          type:'ext_boq',
          from:numero_table,
          to:223,
          libelle:`Table ${numero_table}:${prod.nom}`
        }
      })
    }
  // client.messages
  //   .create({
  //               from: 'whatsapp:+14155238886',
  //       contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
  //       contentVariables: '{"1":"12/1","2":"3pm"}',
  //       to: 'whatsapp:+33768969314'
  //   })
  //   .then(message => console.log(message.sid, message.errorCode));

  
    return {success:true}
  },
}

