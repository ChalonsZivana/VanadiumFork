import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

export async function GET({ url }) {
  try {
    const promoStr = url.searchParams.get('promo');
    const promo = promoStr ? parseInt(promoStr, 10) : null;
    if (!promo) {
      return new Response('Paramètre "promo" manquant', { status: 400 });
    }

    const pg_promo = await prisma.pg.findMany({
      where: { proms: promo },
      select: {
        nums: true,
        nom: true,
        prenom: true,
        solde: true
      }
    });

    pg_promo.sort((a, b) => (a.nums ?? 0) - (b.nums ?? 0));


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PG Promo');

    worksheet.columns = [
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
