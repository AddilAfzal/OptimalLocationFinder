import csv
from datetime import datetime

from django.core.exceptions import ObjectDoesNotExist

from CQC.models import CQCLocation
from Core.methods import postcode_lookup


def import_cqc_locations(csv_path="CQC/data/06_February_2019_CQC_directory.csv"):
    """
    Import all CQC locations from file
    :param csv_path:
    :return:
    """
    with open(csv_path) as csvreader:
        # Open the file
        reader = csv.reader(csvreader, delimiter=',', quotechar='"', )
        i = 0

        # For each row in the file
        for row in reader:
            i += 1
            if i < 5:
                continue

            if i % 1000 == 0:
                print(i)

            # Remove all spaces
            row = [item.strip() for item in row]

            # Join the address
            address = [x.strip() for x in row[2].split(",")]

            # Sort the data into a structure
            data = {
                'name': row[0],
                'street': address[0],
                'postcode': row[3],
                'website': row[5],
                'location_type': row[6],
                'cqc_id': row[13],
                'lat': 0,
                'lng': 0
            }

            # If the address consists of three elements, fetch the second and use it as the town name.
            if address.__len__() == 3:
                data['town'] = address[1]

            # Create the object in the database.
            l = CQCLocation.objects.create(**data)


def update_postcodes():
    """
    Update the lng lat coordinate set using the postcode assigned to each school.
    Used on first import.
    :return:
    """

    def chunks(l, n):
        """Yield successive n-sized chunks from l."""
        for i in range(0, len(l), n):
            yield l[i:i + n]

    # Get all locations from the database
    locations = CQCLocation.objects.all()

    # Get the postcodes associated with all locations.
    postcodes = list(CQCLocation.objects.all().values_list('postcode', flat=True).distinct())

    # Contain postcodes in chunks of 100
    chunked_postcodes = chunks(postcodes, 100)

    i = 0
    for p in chunked_postcodes:
        # For each chunk, call the API
        # print(p)
        results = postcode_lookup(p)

        # For each postcode result, update the CQC locations with their coordinates.
        for result in results:
            # print(result)
            try:
                locations.filter(postcode=result['query']).update(lng=result['result']['longitude'],
                                                                lat=result['result']['latitude'])
            except TypeError:
                print("Failed")
                print(result)
            i += 1

        print(i)


def update_ratings(csv_path="CQC/data/ratings February 2019.csv"):
    """
    Method to import CQC location ratings from file.
    :param csv_path:
    :return:
    """

    # Read the file into memory
    with open(csv_path) as csvreader:
        reader = csv.reader(csvreader, delimiter=',', quotechar='"', )
        i = 0

        # For each row in the file.
        for row in reader:
            i += 1

            # Skip the first two rows.
            if i < 2:
                continue

            if i % 1000 == 0:
                print(i)

            # Remove spaces.
            row = [item.strip() for item in row]

            # Extract the needed data.
            cqc_id = row[0]
            last_inspection_date = datetime.strptime(row[8], "%d/%m/%Y").date()
            last_rating = row[7]

            # Try to find the CQC locations in the database.
            try:
                if row[5] == 'Overall' and row[6] == 'Overall':
                    l = CQCLocation.objects.get(cqc_id=cqc_id)

                    if not l.last_inspection_date or l.last_inspection_date < last_inspection_date:
                        # If the inspection data in the database is older, or does not exist, then overwrite.
                        l.last_inspection_date = last_inspection_date
                        l.last_rating = last_rating
                        l.save()
                continue

            except ObjectDoesNotExist:
                continue
