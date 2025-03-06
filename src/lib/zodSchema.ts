import { consommations_type } from "@prisma/client";
import { number, z } from "zod";

export const EditBoquetteSchema = z
  .object({
    nom: z.string().min(1),
    nom_simple: z.string().min(1),
    password: z.string(),
    password_confirmation: z.string(),
    partie_pg: z
      .string()
      .optional()
      .transform((e) => e == "on"),
  })
  .refine((e) => e.password == e.password_confirmation);

export const CreateProductSchema = z.object({
  nom_produit: z.string().min(1),
  prix_produit: z.number(),
  categorie_produit: z.string(),
  stock: z.number(),
  libre_service: z.union([z.literal("on"), z.undefined()]),
});

export const OnlyDateSchema = z.object({
  date: z
    .string()
    .transform((e) => new Date(parseInt(e)))
    .pipe(z.date()),
});

export const RhopseSchemaFignos = z.object({
  produits: z
    .string()
    .transform((e) => {
      try {
        return JSON.parse(e);
      } catch {
        return null;
      }
    })
    .pipe(z.array(z.tuple([z.number(), z.number()]))),
  rhopse_ancien: z.optional(z.union([z.null(), z.string()])),
  mode_paiement: z.enum(["CB", "LIQ"]),
});

export const AjouterMembreSchema = z.object({
  nums: z.string().transform((e) => parseInt(e)).refine((e) => !isNaN(e)),
  proms:z.string().transform((e) => parseInt(e)).refine((e) => !isNaN(e)),
});

export const RhopseSchema = z.object({
  produits: z
    .string()
    .transform((e) => {
      try {
        return JSON.parse(e);
      } catch {
        return null;
      }
    })
    .pipe(z.array(z.tuple([z.number(), z.number()]))),
  rhopse_ancien: z.optional(z.union([z.null(), z.string()])),
});

export const ImportRhopseSchema = z.object({
  produits: z
    .string()
    .transform((e) => JSON.parse(e))
    .refine(
      (e) =>
        z
          .array(
            z.tuple([
              z.number(),
              z.number(),
              z.number(),
              z.union([z.string(), z.null()]),
            ]),
          )
          .safeParse(e).success,
    ),
});

export const InscriptionSchema = z
  .object({
    email: z.string(),
    nums: z.string(),
    proms: z.string(),
    prenom: z.string(),
    nom: z.string(),
    solde: z.string(),
    bucque: z.string(),
  })
  .transform((data) => ({
    ...data,
    nums: parseInt(data.nums),
    proms: parseInt(data.proms),
    solde: parseFloat(data.solde),
    bucque: data.bucque.length == 0 ? "SQRT" : data.bucque,
  }))
  .refine(
    (data) => {
      return !isNaN(data.nums) && !isNaN(data.proms) && !isNaN(data.solde);
    },
    {
      message: "Invalid numbers",
    },
  );


  export const NuitDesCroutesSchema = z.object({
    taille: z.enum(['']),
    proms: z.string(),
    montant: z.string(),
    libelle: z.string(),
  })

export const EditPgSchema = z
  .object({
    nom: z.string().min(1),
    prenom: z.string().min(1),
    bucque: z.string().min(1),
    email: z.string().min(1),
    nums: z.string().min(1),
    //tabagns:z.string(),
    proms: z.string(),
  })
  .transform((data) => ({
    ...data,
    nums: parseInt(data.nums),
    proms: parseInt(data.proms),
  }))
  .refine(
    (data) => {
      return !isNaN(data.nums) && !isNaN(data.proms);
    },
    {
      message: "Invalid numbers",
    },
  );

export const ConsommationsSchema = z.object({
  page: z
    .string()
    .default("1")
    .transform((e) => parseInt(e))
    .refine((e) => e >= 1),
  nums: z
    .string()
    .default("NaN")
    .transform((e) => parseInt(e)),
  proms: z
    .string()
    .default("NaN")
    .transform((e) => parseInt(e)),
  sortType: z.enum(["date", "montant"]).default("date"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  consoType: z
    .string()
    .default("Tout")
    .refine(
      (e) =>
        Object.values(consommations_type).includes(e as any) || e == "Tout",
    ),
  consoYear: z
    .string()
    .default("NaN")
    .transform((e) => parseInt(e))
    .pipe(
      z.union([z.number().min(1806).max(new Date().getFullYear()), z.nan()]),
    ),
});
export type ConsommationsSchemaType = z.infer<typeof ConsommationsSchema>;

export const PgSearchSchema = z.object({
  page: z
    .string()
    .default("1")
    .transform((e) => parseInt(e))
    .refine((e) => e >= 1),
  proms: z
    .string()
    .default("NaN")
    .transform((e) => parseInt(e)),
  sortType: z.enum(["nums", "solde"]).default("nums"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});
export type PgSearchSchemaType = z.infer<typeof PgSearchSchema>;

export const LydiaDemandResponseSchema = z.object({
  error: z.string(),
  request_id: z.string(),
  request_uuid: z.string(),
  message: z.string(),
  mobile_url: z.string(),
});

export const LydiaDemandFrontSchema = z.object({
  tel: z.string(),
  montant: z
    .string()
    .transform((e) => parseFloat(e))
    .refine((e) => !isNaN(e)),
});

export const LydiaVerifyResponseSchema = z.object({
  state: z.string(),
  used_ease_of_payment: z.string(),
  signature: z.string(),
});

export const StatisticsSchema = z.object({
  jours: z
    .string()
    .transform((e) => parseInt(e))
    .refine((e) => !isNaN(e)),
  take: z
    .string()
    .transform((e) => parseInt(e))
    .refine((e) => !isNaN(e)),
  id_boquette: z
    .string()
    .transform((e) => parseInt(e))
    .refine((e) => !isNaN(e)),
});

export const AddProductSchema = z
  .object({
    nom: z.string().min(1),
    id_categorie: z.string().transform((e) => parseInt(e)),
    nom_categorie: z.string().min(1).optional(),
    prix: z
      .string()
      .transform((e) => parseFloat(e))
      .refine((e) => e > 0),
    prix2: z
      .string()
      .optional()
      .default("0")
      .transform((e) => parseFloat(e))
      .refine((e) => e >= 0),
  })
  .refine((e) => {
    if (!e.nom_categorie) {
      return !isNaN(e.id_categorie);
    }
    return true;
  });

export const EditProductSchema = z.object({
  id_categorie: z
    .string()
    .transform((e) => parseInt(e))
    .refine((e) => !isNaN(e)),
  nom: z.string().min(1),
  id_produit: z
    .string()
    .transform((e) => parseInt(e))
    .refine((e) => !isNaN(e)),
  prix: z
    .string()
    .transform((e) => parseFloat(e))
    .refine((e) => e >= 0),
  prix2: z
    .string()
    .optional()
    .default("0")
    .transform((e) => parseFloat(e))
    .refine((e) => e >= 0),
  inventaire: z
    .string()
    .transform((e) => (e == "" ? null : parseInt(e)))
    .refine((e) => e === null || !isNaN(e)),
});

export const DeleteProductSchema = z.object({
  id_produit: z
    .string()
    .transform((e) => parseInt(e))
    .refine((e) => !isNaN(e)),
});

export const DeleteCategorySchema = z.object({
  id_categorie: z
    .string()
    .transform((e) => parseInt(e))
    .refine((e) => !isNaN(e)),
});

export const topNegatsSchema = z.object({
  proms: z.string().transform((e) => parseInt(e)),
});

export const EnvoiBrouzoufsSchema = z.object({
  nums: z
    .string()
    .transform((e) => parseInt(e))
    .refine((e) => !isNaN(e) && e > 0),
  proms: z
    .string()
    .transform((e) => parseInt(e))
    .refine((e) => !isNaN(e) && e > 220),
  montant: z
    .string()
    .transform((e) => parseFloat(e))
    .refine((e) => !isNaN(e) && e > 0),
  libelle: z.string(),
});

export const RechargementFamsSchema = z.object({
  montant: z
    .string()
    .transform((e) => parseFloat(e))
    .refine((e) => !isNaN(e) && e > 0),
  libelle: z.string(),
});
