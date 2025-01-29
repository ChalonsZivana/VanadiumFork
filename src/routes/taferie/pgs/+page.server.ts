import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { Taferie } from "$lib/server/classes/Taferie";
import { pgsSearch } from "$lib/components/search/pgs/fullsearch";
import { PgSearchSchema } from "$lib/zodSchema.js";

export const load: PageServerLoad = async ({ url }) => {
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const data = PgSearchSchema.safeParse(queryParams);

  if (!data.success) throw error(400);

  return {
    search: await pgsSearch(data.data),
  };
};

export let actions = {
  cancel: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString() ?? "");
    if (isNaN(id)) return fail(400, {});

    await Taferie.cancelConsommation(id, true);
  },
  uncancel: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get("id")?.toString() ?? "");
    if (isNaN(id)) return fail(400, {});

    await Taferie.cancelConsommation(id, false);
  },
};
