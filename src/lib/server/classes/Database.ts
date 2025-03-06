import prisma from "$lib/prisma";

export class Database {
  static async negatsProms(proms: number[]) {
    const result: { [key: number]: number } = {};
    for (let p of proms) {
      const s = await prisma.pg.aggregate({
        where: { proms: p, id_pg: { gt: 0 }, solde: { lt: 0 } },
        _sum: { solde: true },
      });
      if (s._sum.solde != null) {
        result[p] = s._sum.solde;
      }
    }
    return result;
  }

  static async fondsProms(proms: number[]) {
    const result: { [key: number]: number } = {};
    for (let p of proms) {
      const s = await prisma.pg.aggregate({
        where: { id_pg: { gt: 0 }, proms: p },
        _sum: { solde: true },
      });
      if (s._sum.solde != null) {
        result[p] = s._sum.solde;
      }
    }
    return result;
  }

  static async createCategorie(data: { id_boquette: number; nom: string }) {
    if (await prisma.categories.findFirst({ where: data })) {
      return null;
    }
    await prisma.categories.create({ data });
  }

  static async createProduit(data: {
    id_boquette: number;
    id_categorie: number;
    nom: string;
    prix: number;
  }) {
    await prisma.produits.create({ data });
  }

  static getNumsInProms(proms: number) {
    return prisma.pg.findMany({
      where: { proms },
      select: {
        nums: true,
        id_pg: true,
        can_buy: true,
        anciens_autorises: true,
      },
    });
  }
}
