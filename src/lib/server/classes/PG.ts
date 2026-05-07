import prisma from "$lib/prisma";
import type { pg } from "@prisma/client";
import { HasMoney } from "../BasicClasses";
import type { EditPgSchema } from "$lib/zodSchema";
import type { z } from "zod";

export class Pg extends HasMoney {
  constructor(id_pg: number) {
    super("pg", id_pg);
  }

  static async exists(id_pg: number) {
    return (await prisma.pg.findFirst({ where: { id_pg } })) != null;
  }

  async pg() {
    return (await prisma.pg.findFirst({ where: { id_pg: this.ID } })) as pg;
  }

async getPhotosFolder() {
  let photo = await prisma.photos.findFirst({ where: { id_pg: this.ID } });
  const pg = await this.pg();

  if (!photo) {
    photo = await prisma.photos.create({
      data: { id_pg: this.ID, nom: "animaux" },
    });
  }

  if (pg.solde >= 0 || pg.nums == 73) {
    return photo.nom;
  } else {
    return "moche";
  }
}

  // N'édite pas le tabagn's
  async editPg(data: z.infer<typeof EditPgSchema>) {
    await prisma.pg.updateMany({
      where: { id_pg: this.ID },
      data: {
        nom: data.nom,
        prenom: data.prenom,
        bucque: data.bucque,
        email: data.email,
        nums: data.nums,
        proms: data.proms,
      },
    });
  }
}
