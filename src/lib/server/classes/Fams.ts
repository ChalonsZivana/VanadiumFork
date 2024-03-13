import prisma from '$lib/prisma';
import type { fams } from '@prisma/client';
import {HasMoney} from '../BasicClasses'

export class Fams extends HasMoney{
  fams:fams;
  constructor(fams:fams){
    super("fams",fams.nums);
    this.fams = fams;
  }

  static async new(nums:number):Promise<Fams | null>{
    if(nums > 50){
      nums = Math.abs(100 - nums);
    }
    if(nums == 0) nums = 50;
    const fams = await prisma.fams.findFirst({where:{nums}});
    if(fams != null) {
      return new Fams(fams)
    } 
    return null;
  }
}