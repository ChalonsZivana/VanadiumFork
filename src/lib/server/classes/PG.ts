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
    if(isNaN(id_pg)) return null;
    const pg = await prisma.pg.findFirst({where:{id_pg:id_pg}});
    if(pg != null) {
      return new Pg(pg)
    } 
    return null;
  }
}