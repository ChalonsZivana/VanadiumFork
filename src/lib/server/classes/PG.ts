import prisma from '$lib/prisma';
import type { pg } from '@prisma/client';
import {HasMoney} from '../BasicClasses'

export class Pg extends HasMoney{
  constructor(id_pg:number){
    super("pg",id_pg);
  }

  static async exists(id_pg:number){
    return await prisma.pg.findFirst({where:{id_pg}}) != null;
  }

  async pg(){
    return await prisma.pg.findFirst({where:{id_pg:this.ID}}) as pg;
  }

  async incrementRefresh(){
    await prisma.refresh.updateMany({
      where:{id_pg:this.ID}, data:{nombre:{increment:1}}
    });
  }

  async getPhotosFolder(){
    const photo = await prisma.photos.findFirst({where:{id_pg:this.ID}});
    const pg = await this.pg();
    if(pg.solde >= 0){
      return photo?.nom ?? 'paysage'; //'paysage' par défault
    } else {
      return 'moche'; //'moche' si solde négative
    }
  }
}