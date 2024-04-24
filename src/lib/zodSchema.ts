import { z } from "zod";


export const EditBoquetteSchema  = z.object({
  nom:z.string().min(1),
  nom_simple:z.string().min(1),
  password:z.string(),
  password_confirmation:z.string(),
  partie_pg: z.string().optional().transform(e => e == 'on')
}).refine(e => e.password == e.password_confirmation)


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
  produits:z.string().transform(e => JSON.parse(e)).refine(e => z.array(z.tuple([z.number(),z.number()])).safeParse(e).success),
})


export const InscriptionSchema = z.object({
  email: z.string(),
  nums: z.string(),
  proms: z.string(),
  prenom: z.string(),
  nom: z.string(),
  solde: z.string(),
}).transform((data) => ({
  ...data,
  nums: parseInt(data.nums),
  proms: parseInt(data.proms),
  solde: parseFloat(data.solde),
})).refine((data) => {
  return !isNaN(data.nums) && !isNaN(data.proms) && !isNaN(data.solde);
}, {
  message: 'Invalid numbers',
});

export const EditPgSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  bucque:z.string().min(1),
  email: z.string().min(1),
  nums: z.string().min(1),
  //tabagns:z.string(),
  proms: z.string(),
}).transform((data) => ({
  ...data,
  nums: parseInt(data.nums),
  proms: parseInt(data.proms),
})).refine((data) => {
  return !isNaN(data.nums) && !isNaN(data.proms);
}, {
  message: 'Invalid numbers',
});


export const ConsommationsSchema  = z.object({
  page:z.string().transform(e => parseInt(e)),
  nums: z.string().transform(e => parseInt(e)),
  proms: z.string().transform(e => parseInt(e)),
  sortType: z.enum(['date','montant']),
  sortDir: z.enum(['asc', 'desc']),
  consoType:z.string(),
  consoYear:z.string().transform(e => parseInt(e)).refine(e => isNaN(e) || (e >= 2017 && e <= new Date().getFullYear())),
});
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
  montant:z.string().transform(e => parseFloat(e)).refine(e => !isNaN(e)),
});

export const LydiaVerifyResponseSchema = z.object({
  state: z.string(),
  used_ease_of_payment: z.string(),
  signature: z.string()
});

export const StatisticsSchema  = z.object({
  jours:z.string().transform(e=>parseInt(e)).refine(e => !isNaN(e)), 
  take:z.string().transform(e=>parseInt(e)).refine(e => !isNaN(e)), 
  id_boquette:z.string().transform(e=>parseInt(e)).refine(e => !isNaN(e))
});


export const AddProductSchema = z.object({
  nom:z.string().min(1),
  id_categorie:z.string(),
  nom_categorie:z.string().min(1).optional(),
  prix:z.string()
}).transform(
  data => ({
    ...data,
    id_categorie: parseInt(data.id_categorie),
    prix:parseFloat(data.prix)
  })
).refine(data => {
  if('nom_categorie' in data){
    return !isNaN(data.prix)
  } else {
    return !isNaN(data.prix) && !isNaN(data.id_categorie)
  }
})

export const EditProductSchema = z.object({
  id_categorie:z.string().transform(e => parseInt(e)).refine(e => !isNaN(e)),
  nom:z.string().min(1),
  id_produit:z.string().transform(e => parseInt(e)).refine(e => !isNaN(e)),
  prix:z.string().transform(e => parseFloat(e)).refine(e => e > 0)
});

export const DeleteProductSchema = z.object({
  id_produit:z.string().transform(e => parseInt(e)).refine(e => !isNaN(e)),
});
