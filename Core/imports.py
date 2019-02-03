import csv

from Core.models import Postcode


def import_postcodes(csv_path="/home/addil/PycharmProjects/OptimalLocationFinder/Core/data/ukpostcodes.csv"):
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

