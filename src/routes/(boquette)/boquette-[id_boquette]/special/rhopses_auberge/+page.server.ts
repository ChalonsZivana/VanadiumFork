import { Database } from "$lib/server/classes/Database";

// status
// 0 : dernieres commandes
// 1 : en cours de préparaition
// 2 : finish
export const load = async ()=>{
  //TODO rhopses auberge
  return {
    auberge:await Database.getAubergeOrders()
  };
}