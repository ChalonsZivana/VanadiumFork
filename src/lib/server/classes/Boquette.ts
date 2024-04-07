import { HasMoney } from "../BasicClasses";
import prisma from "$lib/prisma";
import type { boquettes } from "@prisma/client";
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

export const BOQUETTES_ALCOOL = {
  "Strass Choco":BOQUETTES["Strass Choco"],
  "Auberge":BOQUETTES["Auberge"],
  "Mousse":BOQUETTES["Mousse"],
  "ZMD":BOQUETTES["ZMD"],
  "Koenettrie":BOQUETTES["Koenettrie"],
}

export const BOQUETTES_NOURRITURES = {
  "K've":BOQUETTES["K've"],
  "Cock's":BOQUETTES["Cock's"],
  "Clac's":BOQUETTES["Clac's"],
  "Copalerie":BOQUETTES["Copalerie"],
  "Mam'serie":BOQUETTES["Mam'serie"],
  "Ritalerie":BOQUETTES["Ritalerie"],
  "Fermière":BOQUETTES["Fermière"],
  //TODO: Breizhouzerie
};

export const BOQUETTES_TOPS = {
  ...BOQUETTES_ALCOOL, ...BOQUETTES_NOURRITURES, "C'vis":BOQUETTES["C'vis"], "Z'boiss":BOQUETTES["Z'boiss"], 
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
      case "ext_boq":
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