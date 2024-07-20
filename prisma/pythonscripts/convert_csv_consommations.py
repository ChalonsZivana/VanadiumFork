path = r"C:\Users\lmgd\OneDrive\Bureau\consommations_202407151617.csv"
output_path = r"C:\Users\lmgd\OneDrive\Bureau\consommations_out.csv"

import csv
import tqdm

def transfertConso(conso):
    [id_conso,id_pg, id_produit,id_boquette,id_conso_bis,date_conso,_,quantite,_,libelle,credit,debit,solde_avant,solde_apres,_,annule] = conso
 
    if annule is None or annule == 0 or annule == ''  or annule == '0':
        annule = False
    else:
        annule = True

    if(id_pg == 0):
        cT = "ext_boq"
        _from = id_boquette
        _to = None
    if(id_pg is not None and id_boquette is not None and not(id_pg!='' and int(id_pg) <= 0)):
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
    
    solde_avant = round(float(solde_avant), 2)
    solde_apres = round(float(solde_apres), 2)
    montant = round(solde_apres - solde_avant, 2)
    if quantite != '' and float(quantite) > 10_000:
        return None
    try:
        return [cT, _from, _to, id_produit, quantite, solde_avant, solde_apres, montant, libelle,date_conso, annule]
    except Exception as e:
        exit()

# Open the input CSV file for reading
with open(path, mode='r', newline='', encoding='utf-8') as input_file:
    # Create a CSV reader object
    csv_reader = csv.reader(input_file, delimiter=',')
    
    # Open the output CSV file for writing
    with open(output_path, mode='w', newline='', encoding='utf-8') as output_file:
        # Create a CSV writer object
        csv_writer = csv.writer(output_file, delimiter=',')
        
        # Iterate through the rows in the input CSV file
        #skip some
        csv_writer.writerow(['type_', 'from_', 'to_', 'id_produit', 'quantite', 'solde_avant', 'solde_apres', 'montant', 'libelle','date_conso', 'annule'])
        next(csv_reader)
        for i, row in tqdm.tqdm(enumerate(csv_reader)):
            new_row = transfertConso(row)
            if new_row is not None:
            # Write each row to the output CSV file
              csv_writer.writerow(new_row)

