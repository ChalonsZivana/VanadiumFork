import prisma from '$lib/prisma';
import type { pg } from '@prisma/client';
import {HasMoney} from '../BasicClasses'

export class Pg extends HasMoney{
  pg:pg;
  constructor(pg:pg){
    super("pg",pg.id_pg);
    this.pg = pg;
  }

  static async new(id_pg:number):Promise<Pg | null>{
    const pg = await prisma.pg.findFirst({where:{id_pg:id_pg}});
    if(pg != null) {
      return new Pg(pg)
    } 
    return null;
  }

  async incrementRefresh(){
    await prisma.refresh.updateMany({
      where:{id_pg:this.ID}, data:{nombre:{increment:1}}
    });
  }

  async getPhotosFolder(){
    const photo = await prisma.photos.findFirst({where:{id_pg:this.ID}});
    if(this.pg.solde >= 0){
      return photo?.nom ?? 'paysage'; //'paysage' par défault
    } else {
      return 'moche'; //'moche' si solde négative
    }
  }
}