import mysql.connector
import psycopg2
import tqdm


try:
    # Source database connection
    connection_source = mysql.connector.connect(
        host='roundhouse.proxy.rlwy.net',
        port='22757',
        user='root',
        password='CdYsTPFVSAAwYNYAjRnnQWcuzmEYZHTN',
        database='railway',
    )
    print("Connected to MySQL database")

    # Destination database connection
    connection_dest = psycopg2.connect(
        host='roundhouse.proxy.rlwy.net',
        port='50558',
        user='postgres',
        password='KmOCsnBxUravpTpxBsCQdBeCllvkXKIV',
        database='railway',
    )
    # connection_source = mysql.connector.connect(
    #     host='srv973.hstgr.io',
    #     port='3306',
    #     user='u225190053_vanadium',
    #     password='Zivana1806$',
    #     database='u225190053_vanadium',
    # )
    print("Connected to PostgreSQL database")

    if connection_source.is_connected():
        print("Connected to MySQL database")

        # Cursors for both connections
        cursor_source = connection_source.cursor()
        cursor_dest = connection_dest.cursor()

        # List of tables to transfer
        tables = ['boquettes', 'bouls', 'categories', 'config', 'consommations', 'export', 'fams', 
                  'historique_fams', 'inscriptions', 'kve', 'motdepasse', 'pg', 'photos', 'produits', 
                  'rechargements', 'refresh', 'remboursement', 'remember', 'rhopseskve', 'spotify']
        
        # Uncomment the line below if you want to test with a single table
        table = "consommations"
        
        print(f"Transferring table: {table}")
        # Select all rows from the source table
        cursor_source.execute(f"SELECT * FROM {table}")
        rows = cursor_source.fetchall()
        print(f"Rows fetched from {table}: {len(rows)}")

        if rows:
            # Prepare the INSERT INTO query for multiple rows
            columns = ', '.join([desc[0] for desc in cursor_source.description])
            values_list = []
            for row in tqdm.tqdm(rows):
                values = ', '.join(f"'{str(value).replace("'", "''")}'" if value is not None else 'NULL' for value in row)
                values_list.append(f"({values})")

            # Construct the full query with all rows
            #insert_query = f"INSERT INTO {table} (id_conso, type_, from_, to_, id_produit, quantite, solde_avant, solde_apres, montant, libelle, date_conso, annule) VALUES {', '.join(values_list)}"
            insert_query = f"INSERT INTO {table} ({columns}) VALUES {', '.join(values_list)}"

            # Execute the full query
            cursor_dest.execute(insert_query)
            connection_dest.commit()
            print(f"Rows inserted into {table}")

        print("Data transfer completed.")

except mysql.connector.Error as e:
    print(f"Error connecting to MySQL database: {e}")
except psycopg2.Error as e:
    print(f"Error connecting to PostgreSQL database: {e}")
finally:
    # Close the connections
    if 'connection_source' in locals() and connection_source.is_connected():
        connection_source.close()
        print("Source MySQL connection closed.")
    
    if 'connection_dest' in locals():
        connection_dest.close()
        print("Destination PostgreSQL connection closed.")
