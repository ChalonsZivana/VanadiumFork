path = r"C:\Users\lmgd\OneDrive\Bureau\historique_fams_202407161228.csv"
output_path = r"C:\Users\lmgd\OneDrive\Bureau\fams_out.csv"
import csv
import tqdm


def transfertFams(transaction):
    [id_transaction, libelle, fams, id_pg, solde_avant, solde_apres, credit, debit, date_transaction, annule] = transaction

    if annule is None or annule == 0 or annule == '' or annule == '0':
        annule = False
    else:
        annule = True

    if(id_pg is None or id_pg == ''):
        print('ok')
        cT = "ext_fams"
        _from = None
        _to = fams
    else:
        cT = "pg_fams"
        _from = id_pg
        _to = fams

    solde_avant = round(float(solde_avant), 2)
    solde_apres = round(float(solde_apres), 2)
    montant = round(solde_apres - solde_avant, 2)
    return [cT, _from, _to, None, None, solde_avant, solde_apres, montant, libelle,date_transaction, annule]

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
        # for _ in range(101419, 281422):
        #   next(csv_reader)
        for i, row in tqdm.tqdm(enumerate(csv_reader)):
            new_row = transfertFams(row)
            if new_row is not None:
            # Write each row to the output CSV file
              csv_writer.writerow(new_row)

