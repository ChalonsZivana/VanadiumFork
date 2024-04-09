import { z } from "zod";


export const EditBoquetteSchema  = z.object({
  Nom:z.string(),
  Identifiant:z.string(),
  "Nouveau mot de passe":z.string(),
  "Confirmation nouveau mot de passe":z.string(),
  "Partie PG": z.union([z.literal('on'), z.undefined()])
})


export const CreateProductSchema  = z.object({
  "nom_produit":z.string().min(1),
  "prix_produit":z.number(),
  "categorie_produit":z.string(),
  "stock":z.number(),
  "libre_service": z.union([z.literal('on'), z.undefined()])
})

export const ImportRhopseSchema = z.array(
  z.tuple([
    z.string(),z.number(), z.number(),
  ])
);

export const RhopseSchema  = z.object({
  produits:z.array(z.tuple([z.number(),z.number()])),
})

export const ConsommationsSchema  = z.object({
  page:z.string(),
  nums: z.union([z.string(), z.null()]),
  proms: z.union([z.string(), z.null()]),
  sortType: z.enum(['date','montant']),
  sortDir: z.enum(['asc', 'desc']),
  consoType:z.string(),
  consoYear:z.union([z.string(), z.null()]),
}).transform(data => ({
  ...data,
  page: parseInt(data.page), // Convert page to integer
  nums: data.nums !== null ? parseInt(data.nums) : null, // Convert nums to integer
  proms: data.proms !== null ? parseInt(data.proms) : null, // Convert proms to integer
  consoYear: data.consoYear !== null ? parseInt(data.consoYear) : null // Convert consoYear to integer
}));
export type ConsommationsSchemaType = z.infer<typeof ConsommationsSchema>


export const LydiaDemandResponseSchema  = z.object({
  error: z.string(),
  request_id: z.string(),
  request_uuid: z.string(),
  message: z.string(),
  mobile_url: z.string()
});

export const LydiaDemandFrontSchema  = z.object({
  tel:z.string(),
  montant:z.string(),
});

export const LydiaVerifyResponseSchema = z.object({
  state: z.string(),
  used_ease_of_payment: z.string(),
  signature: z.string()
});

export const StatisticsSchema  = z.object({
  jours:z.number(), take:z.number(), id_boquette:z.number()
});