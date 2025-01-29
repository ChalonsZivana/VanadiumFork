import { error, fail } from "@sveltejs/kit";
import { consommations_type } from "@prisma/client";
import { Taferie } from "$lib/server/classes/Taferie";
import { consommationsSearch } from "$lib/components/search/consommations/fullsearch";
import { ConsommationsSchema } from "$lib/zodSchema.js";

export const load = async ({ url }) => {
  const queryParams = Object.fromEntries(url.searchParams.entries());

  const data = ConsommationsSchema.safeParse(queryParams);

  if (!data.success) throw error(400);
  const consoType = data.data.consoType as consommations_type | "Tout";

  return {
    search: await consommationsSearch(
      consoType == "Tout" ? [] : [{ type: consoType }],
      data.data,
    ),
  };
};

export const actions = {
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
