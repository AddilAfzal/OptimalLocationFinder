import csv

from Core.models import Postcode, Demographic


def import_postcodes(csv_path="Core/data/ukpostcodes.csv"):
    with open(csv_path) as csvreader:
        reader = csv.reader(csvreader, delimiter=',', quotechar='"',)
        i = 0
        for row in reader:
            if i is not 0:
                if i % 1000 == 0:
                    print(row)

                if i > 333680:
                    try:
                        p = Postcode.objects.create(
                            postal_code=row[1],
                            latitude=float(row[2]),
                            longitude=float(row[3]),
                      )
                    except ValueError as e:
                        print(e)
            i += 1


def import_demographics_data(csv_path="Core/data/ethnic_group_data.csv"):
    with open(csv_path) as csvreader:
        reader = csv.reader(csvreader, delimiter=',', quotechar='"',)
        i = 0
        for row in reader:
            if i is not 0:
                if i % 1000 == 0:
                    print(row)

                row = [item.strip() for item in row]
                Demographic.objects.create(
                    borough=row[1],
                    age=int(row[3]) if not row[3] == 'All ages' else None,
                    ethnic_group=row[4],
                    population_2018=int(row[12]),
                    population_2019=int(row[13]),
                )

            i += 1
