import prisma from "$lib/prisma";
import { LydiaDemandResponseSchema, LydiaVerifyResponseSchema } from "$lib/zodSchema";
import type { Prisma } from "@prisma/client";
import { Taferie } from "./classes/Taferie";



export class LydiaManager {
  static async createLydiaDemand(id_pg:number, varData: { montant: number, numero: string }, vendorKey: string) {
    const _min = 10;
    const _max = 100.89;
    if (varData.montant < _min || varData.montant > _max) return {success:false, message:`Il faut un montant compris ${_min}€ et ${_max}€`}

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
    const lydiaData = LydiaDemandResponseSchema.safeParse(retour);
    if(!lydiaData.success || lydiaData.data.error != "0") return {'error':'Mauvais numéro de téléphone'}

    const createData:Prisma.rechargementsCreateArgs['data']={
      id_pg,
      keylydia:lydiaData.data.request_uuid,
      montant:varData.montant,
      date:new Date(),
      status:0
    }
    await prisma.rechargements.create({data:createData});
    return {success:true, message: 'Demande envoyée, veuillez l\'accepter dans les 120s'};

  } catch(error) {
    console.error('Error creating Lydia demand:', error);
    return {success:false, message: 'Error creating Lydia demand'};
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

        const lydiaData = LydiaVerifyResponseSchema.safeParse(await response.json());
        console.log(lydiaData.data)

        if(!lydiaData.success || lydiaData.data.state == "0") return {success:false, message:'En attente de payement...'}
        console.log(lydiaData.data)
        if(lydiaData.data.state == '1'){
          const d = await prisma.rechargements.update({where:{id_rechargement, status:0}, data:{status:1}});
          await Taferie.rhopse({type:'pg_ext', from:d.id_pg, libelle:"Rechargement Lydia", montant:d.montant});
          return {success:true, message:`${d.montant}€ ont été ajouté à votre sole.`};
        } else {
          await prisma.rechargements.update({where:{id_rechargement}, data:{status:-1}});
          return {success:false, message:'Vous avez refusé le payement.'};
        }
    } catch (error) {
        console.error('Error verifying Lydia demand:', error);
        return null;
    }
  }
}
