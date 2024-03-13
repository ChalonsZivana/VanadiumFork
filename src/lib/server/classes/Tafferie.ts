import prisma from "$lib/prisma";
import { HasMoney } from "../BasicClasses";
import { Boquette } from "./Boquette";
import { Fams } from "./Fams";
import { Pg } from "./PG";


class Tafferie extends HasMoney {
  constructor(){
    super('boquettes',20);
  }

  async cancelConsommation(id_conso:number){
    const conso = await prisma.consommations.findFirst({where:{id_conso}});
    if(!conso) return null;
    const id_pg = conso.id_pg ?? 0

    
    const consummer = id_pg == 0 ? new Tafferie():await Pg.new(id_pg)
    if(consummer == null) return null;

    if(conso.debit) {
      consummer.addMoney(conso.debit)
    }
    await prisma.consommations.update({where:{id_conso},data:{annule:true}});
  }

  async transfertArgent(d:{id_pg:number}|{fams:number}|{id_boquette:number},montant:number,libelle:string){
    if('id_pg' in d){
      const pg = await Pg.new(d.id_pg);
    } else if ('fams' in d){
      const fams = await Fams.new(d.fams);
    } else if ('id_boquette' in d){
      const boq = await Boquette.new(d.id_boquette);
    }
  }
}