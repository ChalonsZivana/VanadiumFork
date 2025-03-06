import { getFams, getPG } from "./db_connection";
import type { pg, fams, boquettes } from "@prisma/client";
import { createHash } from "crypto";

export interface User {
  pg: pg & { can_buy: boolean };
  fams: fams;
}

export type SessionData = {
  user: User | null;
};

export async function createUser(id_pg: number): Promise<User | null> {
  const pg = await getPG(id_pg);
  if (pg == null) return null;
  const fams = await getFams(pg.nums);
  if (fams == null) return null;

  return {
    pg,
    fams,
  } as { pg: pg & { can_buy: boolean }; fams: fams }; //2507:Skou , 2479:Peynetre
}

export async function updateUser(locals: App.Locals) {
  await locals.session.update(async (d) => {
    if (!d.user) return d;
    d.user = await createUser(d.user.pg.id_pg);
    return d;
  });
}

export const hashPassword = (password: string) => {
  let pswd = createHash("sha1");
  pswd.update(password);
  return pswd.digest("hex");
};
