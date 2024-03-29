import prisma from '$lib/prisma';
import type { fams } from '@prisma/client';
import {HasMoney} from '../BasicClasses'

export class Fams extends HasMoney{
  constructor(nums:number){
    nums = nums % 100;
    if(nums > 50) nums = 100 - nums;
    if(nums == 0) nums = 50;
    super("fams",nums);
  }

  async fams(){
    return await prisma.fams.findFirst({where:{nums:this.ID}}) as fams;
  }

  async rhopse(d:{libelle:string, montant:number}){
    const f = await prisma.fams.findFirst({where:{nums:this.ID}});
    if(!f) return null;

    await prisma.historique_fams.create({
      data:{
        libelle:d.libelle,
        credit:d.montant < 0 ? d.montant:null,
        debit:d.montant >= 0 ? d.montant:null,
        fams:this.ID,
        solde_avant:f.solde,
        solde_apres:f.solde + d.montant
      }      
    });
    await prisma.fams.update({where:{nums:this.ID}, data:{solde:f.solde + d.montant}});
  }
}