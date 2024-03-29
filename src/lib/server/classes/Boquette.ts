import { HasMoney } from "../BasicClasses";
import prisma from "$lib/prisma";
import { Pg } from "./PG";
import type { boquettes } from "@prisma/client";
import { error } from "console";
import { Taferie } from "./Taferie";

type typesCroutes = 
    "1/2 Croüte" | 
    "Croüte" |
    "Maxi Croüte" |
    "1/2 Croüte végé" | 
    "Croüte végé" |
    "Maxi Croüte végé";

const BOQUETTES = {
  Fams: -1,
  'Strass Choco': 1,
  "K've": 2,
  Auberge: 3,
  "Cock's": 4,
  "C'vis": 5,
  "Feux d'Art's": 6,
  "Foy's": 7,
  "Gutemb's": 8,
  'Légumes': 9,
  Mousse: 10,
  'Mc Dal': 11,
  'Grand-mère': 12,
  Gasole: 13,
  "Clac's": 14,
  Discale: 15,
  Vizidence: 16,
  Copalerie: 17,
  Matos: 18,
  "Plat's": 19,
  TAFerie: 20,
  Mash: 21,
  IET: 38,
  Infalerie: 111,
  "Dem's": 135,
  "Z'boiss": 136,
  _: 137,
  Skz: 138,
  Paninio: 139,
  Confiserie: 140,
  Modale: 141,
  Piraterie: 142,
  ZMD: 143,
  "Strass Carn's": 144,
  'Le Hun': 145,
  "Z'champ's": 146,
  Koenettrie: 147,
  "Z'phot's": 148,
  Bidouille: 149,
  Mafia: 150,
  'bureau de tarba': 177,
  GAFerie: 192,
  "Mam'serie": 193,
  "K'dal fée d'hons": 194,
  Ritalerie: 195,
  'Fermière': 196
}

export class Boquette extends HasMoney {
  constructor(id_boquette:number){
    super('boquettes', id_boquette);
  }

  async boquette(){
    return await prisma.boquettes.findFirst({where:{id_boquette:this.ID}}) as boquettes;
  }

  static async exists(id_boquette:number){
    return await prisma.boquettes.findFirst({where:{id_boquette}}) != null;
  }

  async rhopseAuberge(data:{id_pg:number, type:string, bandars:string, fromage:string, commentaire:string, telephone:string,status:number}){
    await prisma.auberge.create({data});
  }

  async cancelConsommation(id_conso:number, cancel:boolean){
    const conso = await prisma.consommations.findFirst({where:{id_conso}})
    if(conso == null) return;
    switch(conso.type){
      case "boq_ext":
        if(conso.from != this.ID) return null;
        break;
      case "pg_boq":
        if(conso.to != this.ID) return null;
        break;
      default:
        return null;
    }

    return Taferie.cancelConsommation(id_conso, cancel);
  }
}