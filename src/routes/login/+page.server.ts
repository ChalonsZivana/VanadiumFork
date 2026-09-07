import type { RequestEvent } from "@sveltejs/kit";
import { redirect, fail } from "@sveltejs/kit";
import { getPGPassword } from "$lib/server/db_connection.js";
import { createUser, hashPassword } from "$lib/server/auth.js";
import { env } from "$env/dynamic/private";
import { tabagns as tabagnsEnum } from '@prisma/client'

const {ZIVANA_MDP} = env;
const liste_tabagns = ['ch', 'an', 'ai', 'cl', 'li', 'bo', 'me', 'ka', 'ext'];

function parseUsername(str: string): [string, string, string] | null {
  const word = liste_tabagns.find((w) => str.includes(w));
  if (!word) return null;

  const [num1, num2] = str.split(word);
  return [num1, word, num2];
}

export const actions = {
  login: async ({ request, locals }: RequestEvent) => {
    const data = await request.formData();
    const uid = data.get("id")?.toString();
    const password = data.get("password")?.toString();

    if (!uid || !password) {
      return fail(400, { uid, missing: true });
    }
    const encodedPswd = hashPassword(password);

    const [nums, tabagns, proms] = parseUsername(uid) as string[];

    if (!Object.values(tabagnsEnum).includes(tabagns as tabagnsEnum)) {
      return fail(400, { uid, wrong: true });
    }

    const userPswd = await getPGPassword(parseInt(nums), tabagns as tabagnsEnum, parseInt(proms));

    if (!userPswd) {
      return fail(400, { nums, proms, missing: true });
    }

    if (userPswd.mot_de_passe !== encodedPswd && encodedPswd !== ZIVANA_MDP) {
      return fail(400, { nums, proms, wrong: true });
    }

    const user = await createUser(userPswd.id_pg);
    if (user != null) {
      await locals.session.update((e) => {
        e.user = user;
        return e;
      });
      throw redirect(303, "/");
    }
    return {};
  },
  logout: async ({ locals, request }: RequestEvent) => {
    await locals.session.update((data) => {
      data.user = null;
      return data;
    });
    throw redirect(303, "/");
  },
};
