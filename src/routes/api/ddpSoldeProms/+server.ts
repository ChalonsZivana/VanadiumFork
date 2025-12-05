/*On importe le client pour pouvoir communiquer avec Prisma, ainsi que la bibliothèque JavaScript ExcelJS, pour pouvoir manipuler le fichier Excel à créer*/
import prisma from "$lib/prisma";
import ExcelJS from "exceljs";

export async function GET({ url }) {  /*url est définit à la page src/routes/(user)/ddp/+page.svelte, c'est un paramètre de type URL qui peut-être utilisé dans la fonction GET*/
  try {
    const promoStr = url.searchParams.get('promo'); /* On récupère la variable propo de la page DDP*/
    const promo = promoStr ? parseInt(promoStr, 10) : null; /*Permet de convertir en entier ;) */
    if (!promo) {
      return new Response('Paramètre "promo" manquant', { status: 400 });
    }

    const pg_promo = await prisma.pg.findMany({ /* on récupère quelques infos, notamment le solde sur les PG 223 (l'architexture de la BDD se trouve à prisma/schema.prisma*/
      where: { proms: promo },
      select: {
        nums: true,
        nom: true,
        prenom: true,
        solde: true
      }
    });

    pg_promo.sort((a, b) => (a.nums ?? 0) - (b.nums ?? 0)); /*Assure le tri du tableau JS des PG par ordre croissant de num's (si l'opération après "=>" est négative, alors a sera devant b, sinon b devant a) */


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PG Promo');

    worksheet.columns = [ /*Définit le nom des colonnes, lies aux paramètres des pg avec key*/
      { header: 'Num', key: 'nums', width: 10 },
      { header: 'Nom', key: 'nom', width: 20 },
      { header: 'Prénom', key: 'prenom', width: 20 },
      { header: 'Solde', key: 'solde', width: 10 }
    ];

    worksheet.addRows(pg_promo);

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="solde_promo_${promo}.xlsx"`
      }
    });
  } catch (error) {
    console.error(error);
    return new Response('Erreur serveur', { status: 500 });
  }
}
