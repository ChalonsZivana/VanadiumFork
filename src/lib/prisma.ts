import { PrismaClient } from "@prisma/client";

// Déclare une variable globale pour dev
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Si on est en prod, on crée simplement une instance
// Sinon, on réutilise l'instance globale pour éviter de créer trop de connexions
const prisma =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development"
    ? ["warn", "error"]
    : ["error"]
  });

// On stocke l'instance globalement pour le hot reload en dev
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
