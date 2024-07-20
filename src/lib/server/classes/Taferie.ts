import prisma from "$lib/prisma";
import { sendPush } from "../onesignal";
import { Boquette } from "./Boquette";
import { Fams } from "./Fams";
import { Pg } from "./PG";
import { consommations_type, type consommations, Prisma } from "@prisma/client";

interface pg_ext extends Pick<consommations, "type" | "from" | "montant" | "libelle"> {
  type:"pg_ext",
  from:number
}
interface ext_ extends Pick<consommations, "type" | "to" | "montant" | "libelle"> {
  type:"ext_fams"|"ext_boq",
  to:number
}
interface _to extends Pick<consommations, "type" | "from" | "to" | "montant" | "libelle"> {
  type:"pg_pg" | "pg_fams"
  from:number,
  to:number
}
interface pg_boq extends Pick<consommations, "type" | "from" | "to" | "id_produit" | "quantite"> {
  type: "pg_boq";
  from:number,
  to:number;
  quantite:number;
  id_produit:number;
}

async function getSolde(type:consommations_type, id:number){
  switch (type){
    case "pg_boq":
    case "pg_ext":
    case "pg_fams":
    case "pg_pg":
      const pg = await new Pg(id).pg();
      return pg.solde
    case "ext_fams":
      const fams = await new Fams(id).fams();
      return fams.solde;
    case "ext_boq":
      const boq = await new Boquette(id).boquette();
      return boq.solde;
  }
}

async function getLibelle(d:ext_ | pg_ext | _to | pg_boq){
  switch(d.type){
    case "pg_ext":
      return `[Opération TAFerie] ${d.libelle}`;
    case "pg_boq":
      const prod = await prisma.produits.findFirst({where:{id_produit:d.id_produit}});
      if(prod == null) return null;
      return `Consommation: ${d.quantite} * ${prod.nom}`;
    default:
      return d.libelle;
  }
}

export class Taferie {
  static async cancelConsommation(id_conso:number, cancel:boolean){
    const conso = await prisma.consommations.findFirst({where:{id_conso:id_conso}});

    if(!conso || conso.annule == cancel) return null;
    const factor = cancel ? 1 : -1;

    switch(conso.type){
      case "ext_boq":
        new Boquette(conso.to!).addMoney(conso.montant * factor);
        break;
      case "ext_fams":
        new Fams(conso.to!).addMoney(conso.montant * factor);
        break;
      case "pg_ext":
        new Pg(conso.from!).removeMoney(conso.montant * factor);
        break;
      
      case "pg_boq":
        new Pg(conso.from!).removeMoney(conso.montant * factor);
        new Boquette(conso.to!).addMoney(conso.montant * factor);
        break;
      case "pg_fams":
        new Pg(conso.from!).removeMoney(conso.montant * factor);
        new Fams(conso.to!).addMoney(conso.montant * factor);
        break;
      case "pg_pg":
        new Pg(conso.from!).removeMoney(conso.montant * factor);
        const consoBis = await prisma.consommations.findFirst({where:{id_conso:conso.to??0}});
        if(!consoBis || consoBis.annule == true) return null;
        new Pg(consoBis.from!).removeMoney(conso.montant * factor);
        await prisma.consommations.update({where:{id_conso},data:{annule:cancel}});
        break;
    }

    await prisma.consommations.update({where:{id_conso},data:{annule:cancel}});
  }

  static async rhopse(d:pg_ext | ext_ | _to | pg_boq){
    console.log('rhopse')
    let libelle = await getLibelle(d);

    if(libelle == null) return;
    let solde = await getSolde(d.type, 'from' in d ? d.from : d.to);
    
    let montant:number;

    if(d.type == "pg_boq"){
      const prod = await prisma.produits.findFirst({where:{id_produit:d.id_produit}});
      if(prod == null) return {success:false, message:`erreur`}; 
      if(Math.abs(d.quantite) < 100_000)return {success:false, message:`Quantité trop élevée`}
      montant = -d.quantite * prod.prix;

    } else {
      montant = d.montant;
    }
    if(Math.abs(montant) > 100_000) return {success:false, message:`Montant trop élevé`}

    console.log('what ??', montant)
    const data:Prisma.consommationsCreateArgs['data'] = {
      type:d.type,
      from: "from" in d ? d.from : null,
      to: "to" in d ? d.to : null,
      libelle: libelle,
      montant: montant,
      solde_apres:solde + montant,
      date_conso:new Date(),
      solde_avant:solde,
      id_produit:d.type == "pg_boq" ? d.id_produit : null,
      quantite:d.type == "pg_boq" ? d.id_produit : null,
    }

    const conso = await prisma.consommations.create({data});

    switch(d.type){
      case "pg_pg":
        const pg2 = await prisma.pg.findFirst({where:{id_pg:d.to}});
        if(pg2 == null) return;
        await new Pg(d.from).addMoney(data.montant);
        await new Pg(pg2.id_pg).removeMoney(data.montant);

        data.from = d.to;
        data.montant = -d.montant;
        data.solde_apres = pg2.solde - d.montant;
        const conso2 = await prisma.consommations.create({data});
        await prisma.consommations.update({where:{id_conso:conso.id_conso}, data:{to:conso2.id_conso}});
        await prisma.consommations.update({where:{id_conso:conso2.id_conso}, data:{to:conso.id_conso}});

        break;
      case "ext_boq":
        await new Boquette(d.to).removeMoney(data.montant);
        break;
      case "ext_fams":
        await new Fams(d.to).removeMoney(data.montant);
        break;
      case "pg_boq":
        await new Pg(d.from).addMoney(data.montant);
        await new Boquette(d.to).removeMoney(data.montant);
        break;
      case "pg_ext":
        await new Pg(d.from).addMoney(data.montant);
        break;
      case "pg_fams":
        await new Pg(d.from).addMoney(data.montant);
        await new Fams(d.to).removeMoney(data.montant);
        break;
    }
    sendPush('Rhopse', `${libelle} - ${montant}`);
    return {success:true, message:`Rhopse effectuée: ${data.libelle}`}
  }

  static async consommations(types:({type:consommations_type, from:number}|{type:consommations_type, to:number})[]){
    let include:Prisma.consommationsInclude = {
      from_pg:{select:{nums:true, proms:true}},
      to_pg:{select:{nums:true,proms:true}},
      to_fams:{select:{nums:true}},
      to_boquette:{select:{nom:true}}
    };

    return prisma.consommations.findMany({
      where:types.length > 1 ? {OR:types} : types[0],
      include,
      orderBy:{date_conso:'desc'}
    })
  }

  static async deletePG(id_pg:number){
    return prisma.pg.delete({where:{id_pg}})
  }
}


export type ConsommationsIncludeType = Awaited<ReturnType<typeof Taferie.consommations>>[0];
