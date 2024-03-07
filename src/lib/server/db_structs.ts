

export interface Pg {
  id_pg:string;
  nom:string;
  prenom:string;
  bucque:string;
  nums:string;
  tabagns:string;
  proms:string;
  boquette:string;
  email:string;
  solde:string;
  solde_liquide:string;
  sexe:string;
  dossier_photos:string;
  mot_de_passe?:string;
  sel?:string;
  actif:string;
  droit:string;
  au_tabagns:string;
  badge:string;
  dernier_rappel_mail_negats:string;
  dernier_palier_mail_negats:string;
  temps_negats:string;
  info:string
}

export interface Fams {
  nums:number;
  solde:number;
}

export interface Photos {
  id_pg:number;
  nom:string;
}

export interface Produits {
  id_produit:number;
  id_boquette:number;
  id_categorie:number;
  nom:string;
  prix:number;
  inventaire:number;
  libreservice:number;
  qrcode:number;
}

export interface HistoriqueFams {
  libelle:string;
  fams:number;
  solde_avant:number;
  solde_apres:number;
  credit:number|null;
  debit:number|null;
  date_transaction:Date;
  annule:number|null;
}

export interface Categories {
  id_categorie:number;
  id_boquette:number;
  nom:string;
}

export interface Refresh {
  id_pg:number;
  nombre:number;
}



export interface Top {
  name:string;
  leaderboard:{
    nums:number | null;
    proms:number | null;
    bucque:string | null;
    nombre:number | null;
  }[]
}


export interface Bouls {
  nom:string;
  id_pg:string;
}