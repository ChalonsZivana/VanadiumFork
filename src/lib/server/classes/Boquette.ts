import { HasMoney } from "../BasicClasses";
import prisma from "$lib/prisma";
import { Pg } from "./PG";
import type { boquettes } from "@prisma/client";
import { error } from "console";

type typesCroutes = 
    "1/2 Croüte" | 
    "Croüte" |
    "Maxi Croüte" |
    "1/2 Croüte végé" | 
    "Croüte végé" |
    "Maxi Croüte végé";


export class Boquette extends HasMoney {
  boquette:boquettes;
  constructor(boquette:boquettes){
    super('boquettes', boquette.id_boquette);
    this.boquette = boquette;
  }

  static async new(id_boquette:number):Promise<Boquette | null>{
    if(isNaN(id_boquette)) return null;
    const boquette = await prisma.boquettes.findFirst({where:{id_boquette:id_boquette}});
    if(boquette != null) {
      return new Boquette(boquette)
    } 
    return null;
  }

  async produits(id_categorie:number) {
    return prisma.produits.findMany({where:{id_categorie}});
  }

  async categories(){
    return prisma.categories.findMany({where:{id_boquette:this.ID}});
  }


  async produit(id_produit:number){
    return prisma.produits.findFirst({where:{id_produit}});
  }

  async rhopse(d:{id_pg:number, id_produit:number, quantite:number}){
    if(this.ID == 3) throw error("Ne pas utiliser la fonction 'rhopse' avec l'auberge. ");
    const produit = await this.produit(d.id_produit);
    if(produit == null) return false;
    const pg = await Pg.new(d.id_pg);
    if(pg == null) return false;

    await prisma.consommations.create({
      data:{
        id_boquette: this.ID, id_produit:d.id_produit, id_pg:d.id_pg,
        date_conso:new Date(),
        quantite:d.quantite,
        debit: produit.prix * d.quantite,
        type_solde:"total",
        solde_avant:pg.pg.solde,
        solde_apres:pg.pg.solde + produit.prix * d.quantite,
        libelle:`Consommation: ${d.quantite} * ${produit.nom}`
      }
    });
    await this.addMoney(produit.prix * d.quantite);
    await pg.addMoney(-1 * produit.prix * d.quantite);
    return true;
  }

  async rhopseAuberge(data:{id_pg:number, type:string, bandars:string, fromage:string, commentaire:string, telephone:string,status:number}){
    await prisma.auberge.create({data});
  }
}