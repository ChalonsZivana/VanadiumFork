import prisma from "$lib/prisma";
import { unescape } from "querystring";
import { sendPush } from "../onesignal";
import { Boquette, BOQUETTES } from "./Boquette";
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
  rhopse_ancien:string|null;
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
    case "pg_pg":
      const pg1 = await prisma.pg.findFirst({where:{id_pg:d.from}});
      const pg2 = await prisma.pg.findFirst({where:{id_pg:d.to}});
      if(pg1 == null || pg2 == null) return null;
      return `Transfert (${pg1.nums}ch${pg1.proms}->${pg2.nums}ch${pg2.proms}) ${d.libelle}`;
    case "ext_boq":
    case "ext_fams":
    case "pg_ext":
      return `[Opération TAFerie] ${d.libelle}`;
    case "pg_boq":
      const prod = await prisma.produits.findFirst({where:{id_produit:d.id_produit}});
      if(prod == null) return null;
      
      return `Consommation: ${d.quantite} * ${prod.nom}` + (d.rhopse_ancien ? ` (${d.rhopse_ancien})`:'');
    default:
      return d.libelle;
  }
}

export class Taferie {

  static async cancelConsommation(id_conso:number, cancel:boolean):Promise<{success:boolean, message:string}>{
    const conso = await prisma.consommations.findFirst({where:{id_conso:id_conso}});

    if(!conso || conso.annule == cancel) return {success:false, message:'an error occured'};
    const factor = cancel ? 1 : -1;

    try {
      return await prisma.$transaction(async(p)=>{
        switch(conso.type){
          case "ext_boq":
            new Boquette(conso.to!).addMoney(conso.montant * factor, p);
            break;
          case "ext_fams":
            new Fams(conso.to!).addMoney(conso.montant * factor, p);
            break;
          case "pg_ext":
            new Pg(conso.from!).removeMoney(conso.montant * factor, p);
            break;
          
          case "pg_boq":
            if(conso.to == BOQUETTES["Foy's"]){
              const data = conso.data as {prix:number, prix2:number} | null;
              if(data == null || !data.prix || !data.prix2) throw new Error('old consommation')
              await new Boquette(BOQUETTES["Foy's"]).addMoney(data.prix * factor, p);
              await new Boquette(BOQUETTES["Satan"]).addMoney(data.prix2 * factor, p);
    
              new Pg(conso.from!).removeMoney((data.prix + data.prix2) * factor, p);
            }  else {
              new Boquette(conso.to!).addMoney(conso.montant * factor, p);
              new Pg(conso.from!).removeMoney(conso.montant * factor, p);
            }
            break;
          case "pg_fams":
            new Pg(conso.from!).removeMoney(conso.montant * factor, p);
            new Fams(conso.to!).addMoney(conso.montant * factor, p);
            break;
          case "pg_pg":
            new Pg(conso.from!).removeMoney(conso.montant * factor, p);
            const consoBis = await p.consommations.findFirst({where:{id_conso:conso.to!}});
            if(!consoBis || consoBis.annule == true || conso.libelle != consoBis.libelle) throw new Error();
            new Pg(consoBis.from!).addMoney(conso.montant * factor, p);

            await p.consommations.update({where:{id_conso:consoBis.id_conso},data:{annule:cancel}});
            break;
        }
    
        await p.consommations.update({where:{id_conso},data:{annule:cancel}});

        return {success:true, message:`Consommation ${cancel ?'canceled':'uncanceled'}`};
      });
    } catch(e){
      return {success:false, message:'an error occured'}
    }
  }

  static async rhopse(d:pg_ext | ext_ | _to | pg_boq, authorize_all=false):Promise<{success:boolean, message:string}>{
    let libelle = await getLibelle(d);

    if(libelle == null) return {success:false, message:"an error occured"};
    let solde = await getSolde(d.type, 'from' in d ? d.from : d.to);

    let montant:number;

    if(d.type == "pg_boq"){
      const prod = await prisma.produits.findFirst({where:{id_produit:d.id_produit}});
      if(prod == null) return {success:false, message:`erreur`}; 
      d.to = prod.id_boquette!;
      
      if(Math.abs(d.quantite) > 100_000) return {success:false, message:`Quantité trop élevée`}

      
      montant = -d.quantite * (prod.prix + prod.prix2);
    } else {
      montant = d.montant;
    }

    if(Math.abs(montant) > 100_000) return {success:false, message:`Montant trop élevé`}

    if((d.type == "pg_ext" || d.type == "pg_fams" || d.type == "pg_boq" || d.type == "pg_pg") && montant < 0){
      const pg = await new Pg(d.from).pg();

      if(!pg.can_buy && !authorize_all) return {success:false, message:`Ce pg ne peut pas acheter`}
    }

    const data:Prisma.consommationsCreateArgs['data'] = {
      type:d.type,
      from: "from" in d ? d.from : null,
      to: "to" in d ? d.to : null,
      libelle: libelle,
      montant: montant,
      solde_apres:-9999999999,
      date_conso:new Date(),
      solde_avant:solde,
      id_produit:d.type == "pg_boq" ? d.id_produit : null,
      quantite:d.type == "pg_boq" ? d.id_produit : null,
    }

    try {
      const transaction = await prisma.$transaction(async (p) => {
        const conso = await p.consommations.create({data});

        let solde_apres:number;
        switch(d.type){
          case "pg_pg":{
            const pg2 = await p.pg.findFirst({where:{id_pg:d.to}});
            if(pg2 == null) throw new Error();
            
            const data2 = JSON.parse(JSON.stringify(data)) as typeof data;
            data2.from = pg2.id_pg;
            data2.montant = -conso.montant;
            data2.solde_avant = pg2.solde;
            data2.solde_apres = pg2.solde - conso.montant;
            const conso2 = await p.consommations.create({data:data2});
            

            const pg1_after = await new Pg(d.from).addMoney(data.montant, p);
            const pg2_after = await new Pg(d.to).removeMoney(data.montant, p);
            solde_apres = pg1_after.solde;

            await p.consommations.update({where:{id_conso:conso.id_conso}, data:{to:conso2.id_conso}});
            await p.consommations.update({where:{id_conso:conso2.id_conso}, data:{to:conso.id_conso, solde_apres:pg2_after.solde}});
            break;
          }
          case "ext_boq":{
            const boq_after = await new Boquette(d.to).removeMoney(data.montant, p);
            solde_apres = boq_after.solde;
            break;
          }
          case "ext_fams":{
            const fams_after = await new Fams(d.to).removeMoney(data.montant, p);
            solde_apres = fams_after.solde;
            break;
          }
          case "pg_boq":{
            const prod = await prisma.produits.findFirst({where:{id_produit:d.id_produit}});
            if(prod == null) return {success:false, message:`erreur`}; 
            // specific foys
            if(d.to == BOQUETTES["Foy's"]){    
              console.log(-(prod.prix + prod.prix2)*d.quantite);
              await new Boquette(BOQUETTES["Foy's"]).removeMoney(-prod.prix*d.quantite, p);
              await new Boquette(BOQUETTES["Satan"]).removeMoney(-prod.prix2*d.quantite, p);
              const pg_after = await new Pg(d.from).addMoney(montant, p);
              solde_apres = pg_after.solde

              await p.consommations.update({where:{id_conso:conso.id_conso}, data:{data:{prix:-prod.prix * d.quantite,prix2:-prod.prix2*d.quantite}}})
            }  else {
              await new Boquette(d.to).removeMoney(data.montant, p);
              const pg_after = await new Pg(d.from).addMoney(data.montant, p);
              solde_apres = pg_after.solde
            }
            
            break;    
          }
          case "pg_ext":{
            const pg_after = await new Pg(d.from).addMoney(data.montant, p);
            solde_apres = pg_after.solde
            break;
          }
          case "pg_fams":{
            const pg_after = await new Pg(d.from).addMoney(data.montant, p);
            await new Fams(d.to).removeMoney(data.montant, p);
            solde_apres = pg_after.solde;
            break;
          }
        }
        await p.consommations.update({where:{id_conso:conso.id_conso}, data:{solde_apres}});
        sendPush('Rhopse', `${libelle} - ${montant}`);
      });

      return {success:true, message:`Rhopse effectuée: ${data.libelle}`};
    } catch(e){
      return {success:false, message: 'Erreur'};
    }
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
