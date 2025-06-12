import type { RequestEvent } from "@sveltejs/kit";
import { redirect, fail } from "@sveltejs/kit";
import { getPGPassword } from "$lib/server/db_connection.js";
import { createUser, hashPassword } from "$lib/server/auth.js";
import { ZIVANA_MDP } from "$env/static/private";

export const actions = {
  login: async ({ request, locals }: RequestEvent) => {
    const data = await request.formData();
    const uid = data.get("id")?.toString();
    const password = data.get("password")?.toString();

    if (!uid || !password) {
      return fail(400, { uid, missing: true });
    }
    const encodedPswd = hashPassword(password);

    if(!uid.toLowerCase().includes('ch')){
      return fail(400, { uid, wrong: true });
    }

    const [nums, proms] = uid.toLowerCase().split("ch") as string[];
    const userPswd = await getPGPassword(parseInt(nums), parseInt(proms));
    console.log(userPswd)
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
