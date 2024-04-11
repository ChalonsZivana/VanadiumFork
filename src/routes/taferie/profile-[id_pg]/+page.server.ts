import type { PageServerLoad } from "./$types";
import { createUser, updateUser } from "$lib/server/auth";
import { error, fail, redirect } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { Taferie } from "$lib/server/classes/Taferie";
import { Pg } from "$lib/server/classes/PG";
import { Boquette } from "$lib/server/classes/Boquette";

export const load:PageServerLoad = async ({params})=>{
  const id_pg = parseInt(params.id_pg);
  const user = await createUser(id_pg);
  if(user == null)throw error(404, 'User missing');

  const consommations = prisma.consommations.findMany({
    where:{type:{in:["pg_ext", "pg_boq", "pg_fams", "pg_pg"]},from:id_pg}, 
    orderBy:{date_conso:'desc'}
  });
  return {
   user, consommations
  };
}

export const actions = {
  "transfert":async ({request, params})=>{
    const data = await request.formData();
    const montant = parseFloat(data.get("montant")?.toString()??'');
    const libelle = data.get('libelle')?.toString() ?? '';
    const id_pg = parseInt(params.id_pg);
    if(isNaN(montant) || isNaN(id_pg) || !Pg.exists(id_pg)) throw error(400);

    await Taferie.rhopse({type:"pg_ext", from:id_pg, montant:montant, libelle});
  },
  "cancel":async({request})=>{
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString()??'');
    if(isNaN(id)) return fail(400, {});

    await Taferie.cancelConsommation(id, true);
  },
  "uncancel":async({request})=>{
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString()??'');
    if(isNaN(id)) return fail(400, {});

    await Taferie.cancelConsommation(id, false);
  },
  "fonds_ffams":async({params})=>{
    const id_pg = parseInt(params.id_pg); 
    if(isNaN(id_pg)) throw error(400);
    
    const pg = await new Pg(id_pg).pg();
    const boq = new Boquette(pg.nums);
    if(pg == null) throw error(400);

    await Taferie.rhopse({type:'pg_fams', from:id_pg,to:boq.ID,montant:-pg.solde, libelle:"Fonds vers Fonds Fams"})
  },
  "delete":async({params})=>{
    const id_pg = parseInt(params.id_pg); 
    if(isNaN(id_pg)) throw error(400);
    const pg = await new Pg(id_pg).pg();
    if(pg.solde != 0) return {wrong:'Le solde doit être nul'}

    await Taferie.deletePG(id_pg);
    throw redirect(300, '/taferie')
  }
}