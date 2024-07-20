import mysql.connector
from enum import Enum
import tqdm
import psycopg2

class ConsoType(Enum):
    pg_pg = "pg_pg"
    pg_boq = "pg_boq"
    pg_fams = "pg_fams"
    ext_fams = "ext_fams"
    ext_boq = "ext_boq"
    pg_ext = "pg_ext"



def transfertConso(conso):
    [id_conso,id_pg, id_produit,id_boquette,id_conso_bis,date_conso,_,quantite,_,libelle,credit,debit,solde_avant,solde_apres,_,annule] = conso
    if annule is None or annule == 0:
        annule = False
    else:
        annule = True

    if(id_pg == 0):
        cT = "ext_boq"
        _from = id_boquette
        _to = None
    if(id_pg is not None and id_boquette is not None and id_pg > 0):
        cT = "pg_boq"
        _from = id_pg
        _to = id_boquette
    elif(id_pg is not None and id_conso_bis is not None): 
        cT = "pg_pg"
        _from = id_pg
        _to = id_conso_bis
    elif(id_boquette != None): 
        cT = "ext_boq"
        _from = None
        _to = id_boquette
    elif(id_pg is not None): 
        cT = "pg_ext"
        _from = id_pg
        _to = None
    
    montant = solde_apres - solde_avant
    try:
        return [cT, _from, _to, id_produit, quantite, solde_avant, solde_apres, montant, libelle,date_conso, annule]
    except Exception as e:
        exit()
    

def transfertFams(transaction):
    [id_transaction, libelle, fams, id_pg, solde_avant, solde_apres, credit, debit, date_transaction, annule] = transaction

    if annule is None or annule == 0:
        annule = False
    else:
        annule = True


    if(id_pg is None):
        cT = "ext_fams"
        _from = None
        _to = fams
    else:
        cT = "pg_fams"
        _from = id_pg
        _to = fams

    montant = solde_apres - solde_avant
    return [cT, _from, _to, None, None, solde_avant, solde_apres, montant, libelle,date_transaction, annule]
    


try:
    connection_source = mysql.connector.connect(
        host='srv973.hstgr.io',
        port='3306',
        user='u225190053_vanadium',
        password='Zivana1806$',
        database='u225190053_vanadium',
    )
    connection = psycopg2.connect(
        host='roundhouse.proxy.rlwy.net',
        port='50558',
        user='postgres',
        password='KmOCsnBxUravpTpxBsCQdBeCllvkXKIV',
        database='railway',
    )
    # connection = mysql.connector.connect(
    #       host='monorail.proxy.rlwy.net',
    #       port='30488',
    #       user='root',
    #       password='vzslMiTslCWzAhBekaZOzDICuBlqtBCd',
    #       database='railway',
    # )
    if connection_source.is_connected():
        print("Connected to MySQL database")
        # Perform database operations here
        cursor_source = connection_source.cursor()
        cursor = connection.cursor()
        for i in range(0,100):
            cursor_source.execute(f"""
                (SELECT 'consommations' AS source_table, date_conso AS date, id_conso, NULL AS id_transaction
                FROM consommations)
                UNION ALL
                (SELECT 'historique_fams' AS source_table, date_transaction AS date, NULL AS id_conso, id_transaction
                FROM historique_fams)
                ORDER BY date DESC
                LIMIT 10000
                OFFSET {10000 * i}
            """)
            rows = cursor_source.fetchall()
            print(rows[:10])
            cursor_source.execute("SELECT * FROM consommations")
            consos = {row[0]:row for row in cursor_source.fetchall()}

            cursor_source.execute("SELECT * FROM historique_fams")
            transaction = {row[0]:row for row in cursor_source.fetchall()}

            data = []
            for row in tqdm.tqdm(rows):
                [table,date,id_conso, id_transaction] = row

                if table == 'consommations':
                    data.append(transfertConso(consos[id_conso]))
                elif table == 'historique_fams':
                    data.append(transfertFams(transaction[id_transaction]))
            
            insert_query = """INSERT INTO consommations (type_, from_, to_, id_produit, quantite, solde_avant, solde_apres, montant, libelle, date_conso, annule) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

            cursor.executemany(insert_query, data)
            connection.commit()

except mysql.connector.Error as e:
    print(f"Error connecting to MySQL database: {e}")
finally:
    # Close the connection
    if 'connection' in locals() :
        connection.close()
        print("MySQL connection closed")

