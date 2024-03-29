import prisma from "$lib/prisma";
import { z } from "zod";
import { Pg } from "./classes/PG";

const lydiaDemandSchema  = z.object({
  error: z.string(),
  request_id: z.string(),
  request_uuid: z.string(),
  message: z.string(),
  mobile_url: z.string()
});

const lydiaVerifySchema = z.object({
  state: z.string(),
  used_ease_of_payment: z.string(),
  signature: z.string()
})

export class LydiaManager {
  static async createLydiaDemand(id_pg:number, varData: { montant: number, numero: string }, vendorKey: string) {
    const _min = 10;
    const _max = 100.89;
    if (varData.montant < _min || varData.montant > _max) return {error:`Il faut un montant compris ${_min}€ et ${_max}€`}

    const data = new URLSearchParams({
      amount: varData.montant.toString(),
      payment_method: 'lydia',
      vendor_token: vendorKey,
      user_token: '',
      recipient: varData.numero,
      currency: 'EUR',
      type: 'phone',
      display_confirmation: 'yes',
      notify: 'yes',
      expire_time: '120'
  });

  try {
    const response = await fetch('https://lydia-app.com/api/request/do.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    });

    const retour = await response.json();
    const lydiaData = lydiaDemandSchema.safeParse(retour);
    if(!lydiaData.success || lydiaData.data.error != "0") return {'error':'Mauvais numéro de téléphone'}

    await prisma.rechargements.create({
      data:{
        id_pg,
        keyLydia:lydiaData.data.request_uuid,
        montant:varData.montant,
        date:new Date()
      }
    });
    return {ok: 'Demande envoyée, veuillez l\'accepter dans les 120s'};

  } catch(error) {
    console.error('Error creating Lydia demand:', error);
    return {'error': 'Error creating Lydia demand'};
  }
  }

  static async verifyLydiaDemand(id_rechargement:number, vendorKey: string, uuid: string): Promise<any> {
    const data = new URLSearchParams({
        request_uuid: uuid,
        vendor_token: vendorKey
    });

    try {
        const response = await fetch('https://lydia-app.com/api/request/state.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data.toString()
        });

        const lydiaData = lydiaVerifySchema.safeParse(await response.json());
        if(!lydiaData.success || lydiaData.data.state == "0") return {'error':'En attente de payement...'}

        if(lydiaData.data.state == '1'){
          const d = await prisma.rechargements.update({where:{id_rechargement}, data:{status:1}});
          new Pg(d.id_pg).addMoney(d.montant);
          return {ok:`${d.montant}€ ont été ajouté à votre sole.`}
        } else {
          await prisma.rechargements.update({where:{id_rechargement}, data:{status:-1}});
          return {'error':'Vous avez refusé le payement.'}
        }
    } catch (error) {
        console.error('Error verifying Lydia demand:', error);
        return null;
    }
  }
}
