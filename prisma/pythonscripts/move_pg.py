import mysql.connector
import tqdm


def transfertPg(id_pg):
    cursor.execute("SELECT * FROM pg_old WHERE id_pg=%s LIMIT 1", (id_pg,))
    pg = [id_pg, nom,prenom,bucque,nums,tabagns,proms,_,email,solde,_,_,_, mot_de_passe, _,actif,ddp,*_] = cursor.fetchall()[0]

    try:
        insert_query = """INSERT INTO pg (id_pg, nom,prenom,bucque,nums,tabagns,proms,email,solde,mot_de_passe,actif,ddp) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s)"""
        cursor.execute(insert_query, (id_pg, nom,prenom,bucque,nums,tabagns,proms,email,solde, mot_de_passe, actif, ddp))
        connection.commit()
    except Exception as e:
        print(pg)
        exit()
    

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
        cursor.execute("""SELECT id_pg FROM pg_old""")
        rows = cursor.fetchall()
        for row in tqdm.tqdm(rows):
            [id_pg] = row

            transfertPg(id_pg)

except mysql.connector.Error as e:
    print(f"Error connecting to MySQL database: {e}")
finally:
    # Close the connection
    if 'connection' in locals() and connection.is_connected():
        connection.close()
        print("MySQL connection closed")

