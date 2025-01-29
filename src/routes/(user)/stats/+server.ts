import { getTop } from '$lib/server/db_connection';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

export async function POST({ params, request }) {
  const a = await request.json();
  const aParsed = z.object({id_boquette: z.number(), nom:z.string()}).safeParse(a);
  if(aParsed.success === false) throw new Error('Invalid body');
  const b = await getTop(aParsed.data.nom, aParsed.data.id_boquette);
  return json(b);
}