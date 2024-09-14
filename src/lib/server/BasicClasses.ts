import type { Prisma } from "@prisma/client";

// Process
// Ajouter argent quelque part
// Enlever argent quelque part
// Noter transfert

type Tables = "boquettes" | "pg"| "fams";

export class HasMoney {
  T:Tables;
  ID:number;
  constructor(t:Tables, id:number, ){
    this.T = t;
    this.ID = id;
  }


  async addMoney(money:number, p:Prisma.TransactionClient) {
    switch(this.T){
      case "boquettes":
        return await p.boquettes.update({
          where:{id_boquette:this.ID},
          data:{solde:{increment:money}},
        });
      case "pg":
        return await p.pg.update({
          where:{id_pg:this.ID},
          data:{solde:{increment:money}}
        });
      case "fams":
          return await p.fams.update({
            where:{nums:this.ID},
            data:{solde:{increment:money}}
          });
    }
  }

  async removeMoney(money:number, p:Prisma.TransactionClient) {
    return await this.addMoney(money * -1, p);
  }
}