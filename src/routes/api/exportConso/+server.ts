import prisma from "$lib/prisma";
import ExcelJS from "exceljs";

export async function GET({ url }) {
  try {
    const nums = url.searchParams.get("nums");
    const promsStr = url.searchParams.get("proms");
    const libelle = url.searchParams.get("libelle");
    let sortType = url.searchParams.get("sortType") ?? "date_conso";
    const sortDir = url.searchParams.get("sortDir") ?? "desc";

    const consoType = url.searchParams.get("consoType");
    const consoYear = url.searchParams.get("consoYear");
    if (sortType === "date") sortType = "date_conso";
    // 🔹 Si aucune promo n’est passée, on prend 224 par défaut
    const proms = promsStr ? parseInt(promsStr, 10) : 224;

    // 🔹 Construction du filtre Prisma
    const where: any = {
      from_pg: {
        proms, // par défaut 224
      },
    };

    if (nums) where.from_pg.nums = parseInt(nums, 10);
    if (libelle)
      where.libelle = { contains: libelle, mode: "insensitive" };
    if (consoType && consoType !== "Tout") where.type = consoType;
    if (consoYear)
      where.date_conso = {
        gte: new Date(`${consoYear}-01-01`),
        lt: new Date(`${parseInt(consoYear) + 1}-01-01`),
      };
      

    // 🔹 Récupération des consommations + jointure PG
    const consommations = await prisma.consommations.findMany({
  where,
  include: {
    from_pg: true,
  },
  orderBy: {
    [sortType]: sortDir,
  }
});


    // 🔹 Préparation des données pour Excel
    const dataForExcel = consommations.map((c) => ({
      nums: c.from_pg?.nums ?? "",
      proms: c.from_pg?.proms ?? "",
      nom: c.from_pg?.nom ?? "",
      prenom: c.from_pg?.prenom ?? "",
      libelle: c.libelle,
      montant: c.montant,
      date: c.date_conso.toISOString().split("T")[0],
      type: c.type,
    }));

    // 🔹 Création du fichier Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Consommations");

    worksheet.columns = [
      { header: "Num", key: "nums", width: 10 },
      { header: "Prom", key: "proms", width: 10 },
      { header: "Nom", key: "nom", width: 20 },
      { header: "Prénom", key: "prenom", width: 20 },
      { header: "Libellé", key: "libelle", width: 30 },
      { header: "Montant", key: "montant", width: 10 },
      { header: "Date", key: "date", width: 15 },
      { header: "Type", key: "type", width: 15 },
    ];

    worksheet.addRows(dataForExcel);

    // 🔹 Active le filtre automatique sur la première ligne
    worksheet.autoFilter = {
      from: "A1",
      to: "H1",
    };

    // 🔹 Gèle la première ligne pour garder les en-têtes visibles
    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="consommations_promo_${proms}.xlsx"`,
      },
    });
  } catch (err) {
    console.error("Erreur exportConso:", err);
    return new Response("Erreur serveur", { status: 500 });
  }
}
