import csv
from datetime import datetime

from Core.methods import postcode_lookup
from Core.models import Postcode
from Schools.models import School, OfstedInspection


def import_schools(csv_path="Schools/data/england_spine.csv"):

    def get_gender(gender):
        if gender == 'Mixed':
            return School.MIXED
        elif gender == 'Boys':
            return School.BOYS
        elif gender == 'Girls':
            return School.GIRLS
        else:
            return School.MIXED

    with open(csv_path) as csvreader:
        reader = csv.reader(csvreader, delimiter=',', quotechar='"',)
        i = 0
        for row in reader:
            row = [item.strip() for item in row]
            school = School.objects.create(
                urn=int(row[0].strip('\ufeff')),
                name=row[4],
                other_name=row[5],
                street=row[6],
                locality=row[7],
                town=row[9],
                postcode=row[10],
                phone=row[11],
                is_new=(row[15] == '1'),
                is_primary=(row[19] == '1'),
                is_secondary=(row[20] == '1'),
                is_post16=(row[21] == '1'),
                age_from=int(row[22]),
                age_to=int(row[23]),
                gender=get_gender(row[24]),
                sixth_form_gender=get_gender(row[25]),
                religion=(None if row[26] in ['None', 'Does not apply'] else row[26]),
                selective=(row[27] == 'Selective'),
                lng=0,
                lat=0,
            )
            i += 1
            if i % 100 == 0:
                print(i)
            # print(row)


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

    schools = School.objects.all()
    postcodes = list(School.objects.all().values_list('postcode', flat=True).distinct())
    chunked_postcodes = chunks(postcodes, 100)

    i = 0
    for p in chunked_postcodes:
        # print(p)
        results = postcode_lookup(p)

        for result in results:
            # print(result)
            try:
                schools.filter(postcode=result['query']).update(lng=result['result']['longitude'],
                                                                lat=result['result']['latitude'])
            except TypeError:
                print("Failed")
                print(result)
            i += 1

        print(i)

#
# def update_postcodes_two():
#     i = 0
#
#     for s in School.objects.all():
#         try:
#             p = Postcode.objects.get(postal_code=s.postcode)
#             s.lat = p.latitude
#             s.lng = p.longitude
#             s.save()
#         except (TypeError, IndexError) as e:
#             print(e)
#             pass
#
#         if i % 100 == 0:
#             print(i)
#         i += 1


def import_ofsted_data(csv_path="Schools/data/england_ofsted-schools.csv"):
    with open(csv_path) as csvreader:
        reader = csv.reader(csvreader, delimiter=',', quotechar='"', )
        i = 0
        for row in reader:
            i += 1
            if i == 1:
                continue

            print(row)
            urn = int(row[0])
            inspection_date = datetime.strptime(row[3], '%d/%m/%Y')
            publication_date = datetime.strptime(row[4], '%d/%m/%Y')
            rating = row[5]

            school = School.objects.filter(urn=urn).first()

            if school:
                OfstedInspection.objects.create(school=school,
                                                inspection_date=inspection_date,
                                                publication_date=publication_date,
                                                overall_effectiveness=rating)
                print(i)
            else:
                print("Skipped")
