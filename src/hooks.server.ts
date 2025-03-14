import { error, redirect } from "@sveltejs/kit";
import { handleSession } from "svelte-kit-cookie-session";
import { SESSION_TOKEN } from "$env/static/private";
import { createUser } from "$lib/server/auth";
import prisma from "$lib/prisma";

const Taferie224_id_pgs = {
  '44ch224':2807,
  '73ch224':2822,
  '71ch224':2831,
  '94ch224':2871
}

export const handle = handleSession(
  {
    secret: SESSION_TOKEN,
    expires: 30,
    expires_in: "days",
  },
  async ({ event, resolve }) => {
    const routeId = event.route.id;
    const sessionData = event.locals.session.data;

    if (!routeId) throw error(404);

    if (routeId.startsWith("/login") || routeId.startsWith("/(unauthorized)"))
      return resolve(event);

    const vanazocque = await prisma.config.findMany({
      where: { nom: "vanazocque" },
    });

    // si vanazocque, redirige vers TAFerie si possible
    if (vanazocque[0].valeur == "1" && !routeId.startsWith("/taferie")) {
      const isInTaferie = await prisma.appartenance_boquettes.findFirst({
        where: {id_boquette:20, id_pg:sessionData.user?.pg.id_pg}
      })
      if (isInTaferie) {
        throw redirect(307, "/taferie");
      }

      throw redirect(307, "/vanazocque");
    }

    if (routeId.startsWith("/(user)")) {
      // check the connexion of the user
      const user = sessionData.user;
      if (user) {
        await event.locals.session.update(async (d) => {
          d.user = await createUser(user.pg.id_pg);
          return d;
        });
        // verifie si DDP
        if (routeId.startsWith("/(user)/ddp") && user.pg.ddp == false) {
          throw error(401);
        }
        return resolve(event);
      }
    }
    // le pg doit impérativement être connecté pour accéder à une boquette
    if (sessionData.user == undefined) throw redirect(303, "/login");

    // le pg doit appartenir à la 223 ou plus pour accéder à une boquette
    if (sessionData.user.pg.proms < 223) throw error(401);


    const isInTaferie = await prisma.appartenance_boquettes.findFirst({
      where: {id_boquette:20, id_pg:sessionData.user?.pg.id_pg}
    })// 20 est l'ID de la TAFerie

    if (routeId.startsWith("/taferie") && !isInTaferie) {
      throw redirect(303, "/");
    }

    // le but est de vérifier que la personne a le droit 
    if (routeId.startsWith("/(boquette)") && !isInTaferie) {
      const regex = /\(boquette\)\/boquette-(\d+)/;
      let id_boquette = parseInt(event.params["id_boquette"] ?? "");
      if (isNaN(id_boquette))
        id_boquette = parseInt(event.route.id?.match(regex)?.at(1) ?? "");
      if (isNaN(id_boquette)) throw error(404);

      const isInBoquette = await prisma.appartenance_boquettes.findFirst({
        where: {id_boquette, id_pg:sessionData.user?.pg.id_pg}
      });
      if (!isInBoquette)  throw redirect(303, "/");

      // verification de proms: restriction de l'accès aux boquettes pour les 224
      // if (sessionData.user.pg.proms === 224 && !Object.values(Taferie224_id_pgs).includes(sessionData.user.pg.id_pg)) {
      //   if(!routeId.startsWith("/(boquette)/boquette-[id_boquette]/special/rhopses")) {
      //     throw redirect(303, "/boquette-" + id_boquette + "/special/rhopses");
      //   }
      // } 
    } 

    return resolve(event);
  },
);
