import mysql.connector
from enum import Enum
import tqdm
class ConsoType(Enum):
    pg_pg = "pg_pg"
    pg_boq = "pg_boq"
    pg_fams = "pg_fams"
    ext_fams = "ext_fams"
    ext_boq = "ext_boq"
    pg_ext = "pg_ext"



def transfertConso(id_conso):
    cursor.execute("SELECT * FROM consommations_old WHERE id_conso=%s LIMIT 1", (id_conso,))
    conso = [id_conso,id_pg, id_produit,id_boquette,id_conso_bis,date_conso,_,quantite,_,libelle,credit,debit,solde_avant,solde_apres,_,annule] = cursor.fetchall()[0]
    annule = [True,False][annule is None]

    if(id_pg == 0):
        cT = "boq_ext"
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
        insert_query = """INSERT INTO consommations (type, `from`, `to`, id_produit, quantite, solde_avant, solde_apres, montant, libelle, date_conso, annule) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(insert_query, (cT, _from, _to, id_produit, quantite, solde_avant, solde_apres, montant, libelle,date_conso, annule))
        connection.commit()
    except Exception as e:
        print(insert_query)
        exit()
    

def transfertFams(id_transaction):
    cursor.execute("SELECT * FROM historique_fams WHERE id_transaction=%s LIMIT 1", (id_transaction,))
    [id_transaction, libelle, fams, id_pg, solde_avant, solde_apres, credit, debit, date_transaction, annule] = cursor.fetchall()[0]

    annule = [False,True][annule == 1]

    if(id_pg is None):
        cT = "ext_fams"
        _from = None
        _to = fams
    else:
        cT = "pg_fams"
        _from = id_pg
        _to = fams

    montant = solde_apres - solde_avant
    insert_query = """INSERT INTO consommations (type, `from`, `to`, id_produit, quantite, solde_avant, solde_apres, montant, libelle, date_conso, annule) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    cursor.execute(insert_query, (cT, _from, _to, None, None, solde_avant, solde_apres, montant, libelle,date_transaction, annule))
    connection.commit()



try:
    connection = mysql.connector.connect(
          host='127.0.0.1',
          user='root',
          password='password',
          database='vanadium',
    )
    if connection.is_connected():
        print("Connected to MySQL database")
        # Perform database operations here
        cursor = connection.cursor()
        cursor.execute("""
            SELECT 'consommations' AS source_table, date_conso AS date, id_conso, NULL AS id_transaction
            FROM consommations_old
            UNION ALL
            SELECT 'historique_fams' AS source_table, date_transaction AS date, NULL AS id_conso, id_transaction
            FROM historique_fams
            ORDER BY date;"""
        )
        rows = cursor.fetchall()
        for row in tqdm.tqdm(rows):
            [table,date,id_conso, id_transaction] = row

            if table == 'consommations':
                transfertConso(id_conso=id_conso)
            elif table == 'historique_fams':
                transfertFams(id_transaction=id_transaction)

except mysql.connector.Error as e:
    print(f"Error connecting to MySQL database: {e}")
finally:
    # Close the connection
    if 'connection' in locals() and connection.is_connected():
        connection.close()
        print("MySQL connection closed")

