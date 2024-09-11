import prisma from "$lib/prisma";

// Process
// Ajouter argent quelque part
// Enlever argent quelque part
// Noter transfert

type Tables = "boquettes" | "pg"| "fams";

export class HasMoney {
  T:Tables;
  ID:number;
  constructor(t:Tables, id:number){
    this.T = t;
    this.ID = id;
  }


  async addMoney(money:number) {
    switch(this.T){
      case "boquettes":
        await prisma.boquettes.update({
          where:{id_boquette:this.ID},
          data:{solde:{increment:money}}
        });
        
        break;
      case "pg":
        await prisma.pg.updateMany({
          where:{id_pg:this.ID},
          data:{solde:{increment:money}}
        });
        break;
      case "fams":
          await prisma.fams.update({
            where:{nums:this.ID},
            data:{solde:{increment:money}}
          });
          break;
    }
  }

  async removeMoney(money:number) {
    await this.addMoney(money * -1);
  }
}