import mysql.connector
from concurrent.futures import ThreadPoolExecutor
from enum import Enum
import tqdm
import time

class ConsoType(Enum):
    pg_pg = "pg_pg"
    pg_boq = "pg_boq"
    pg_fams = "pg_fams"
    ext_fams = "ext_fams"
    ext_boq = "ext_boq"
    pg_ext = "pg_ext"

def create_db_connection():
    return mysql.connector.connect(
        host='roundhouse.proxy.rlwy.net',
        port='22757',
        user='root',
        password='CdYsTPFVSAAwYNYAjRnnQWcuzmEYZHTN',
        database='railway',
    )

def transfertConso(connection, batch):
    cursor = connection.cursor()
    insert_query = """INSERT INTO consommations (type, `from`, `to`, id_produit, quantite, solde_avant, solde_apres, montant, libelle, date_conso, annule) 
                      VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    cursor.executemany(insert_query, batch)
    connection.commit()

def transfertFams(connection, batch):
    cursor = connection.cursor()
    insert_query = """INSERT INTO consommations (type, `from`, `to`, id_produit, quantite, solde_avant, solde_apres, montant, libelle, date_conso, annule) 
                      VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    cursor.executemany(insert_query, batch)
    connection.commit()

def process_batch(rows):
    connection = create_db_connection()
    conso_batch = []
    fams_batch = []

    for row in tqdm.tqdm(rows):
        table, date, id_conso, id_transaction = row

        if table == 'consommations':
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM consommations_old WHERE id_conso=%s LIMIT 1", (id_conso,))
            conso = cursor.fetchone()
            id_conso, id_pg, id_produit, id_boquette, id_conso_bis, date_conso, _, quantite, _, libelle, credit, debit, solde_avant, solde_apres, _, annule = conso
            annule = annule is None

            if id_pg == 0:
                cT = "ext_boq"
                _from = id_boquette
                _to = None
            elif id_pg is not None and id_boquette is not None and id_pg > 0:
                cT = "pg_boq"
                _from = id_pg
                _to = id_boquette
            elif id_pg is not None and id_conso_bis is not None:
                cT = "pg_pg"
                _from = id_pg
                _to = id_conso_bis
            elif id_boquette is not None:
                cT = "ext_boq"
                _from = None
                _to = id_boquette
            elif id_pg is not None:
                cT = "pg_ext"
                _from = id_pg
                _to = None

            montant = solde_apres - solde_avant
            conso_batch.append((cT, _from, _to, id_produit, quantite, solde_avant, solde_apres, montant, libelle, date_conso, annule))

        elif table == 'historique_fams':
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM historique_fams WHERE id_transaction=%s LIMIT 1", (id_transaction,))
            fams = cursor.fetchone()
            id_transaction, libelle, fams, id_pg, solde_avant, solde_apres, credit, debit, date_transaction, annule = fams
            annule = annule == 1

            if id_pg is None:
                cT = "ext_fams"
                _from = None
                _to = fams
            else:
                cT = "pg_fams"
                _from = id_pg
                _to = fams

            montant = solde_apres - solde_avant
            fams_batch.append((cT, _from, _to, None, None, solde_avant, solde_apres, montant, libelle, date_transaction, annule))

    if conso_batch:
        transfertConso(connection, conso_batch)
    if fams_batch:
        transfertFams(connection, fams_batch)

    connection.close()

def main():
    try:
        connection = create_db_connection()
        if connection.is_connected():
            print("Connected to MySQL database")
            cursor = connection.cursor()
            cursor.execute("""
                SELECT 'consommations' AS source_table, date_conso AS date, id_conso, NULL AS id_transaction
                FROM consommations_old
                WHERE date_conso > '2023-01-01'
                UNION ALL
                SELECT 'historique_fams' AS source_table, date_transaction AS date, NULL AS id_conso, id_transaction
                FROM historique_fams
                WHERE date_transaction > '2023-01-01'
                ORDER BY date"""
            )
            rows = cursor.fetchall()
            batch_size = 2_000  # Start with a batch size of 5000
            print(len(rows))
            # Split rows into batches
            batches = [rows[i:i + batch_size] for i in range(0, len(rows), batch_size)]
            
            start_time = time.time()
            
            with ThreadPoolExecutor(max_workers=16) as executor:  # Adjust number of workers as needed
                executor.map(process_batch, batches)
            
            end_time = time.time()
            print(f"Total time taken: {end_time - start_time} seconds")
    
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL database: {e}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            connection.close()
            print("MySQL connection closed")

if __name__ == "__main__":
    main()
