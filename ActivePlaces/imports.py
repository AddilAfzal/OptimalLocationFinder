import json

from django.db.models import OneToOneField

from ActivePlaces.models import ActivePlace, Equipment, Disability, Contacts, Facility, OpeningTimes, Activity


def import_data(data_path="Core/data/Active Places Open Data_2019_02_15.sites.json"):

    with open(data_path) as f:
        data = json.load(f)

    for item in data['items']:

        if item['state'] == 'deleted':
            continue

        # Create equipment and disability model

        print(item)
        equipment = Equipment.objects.create(**item['data']['equipment'])

        disability = Disability.objects.create(**item['data']['disability']['equipped'],
                                               access=item['data']['disability']['access'])

        contact = None
        for c in item['data']['contacts']:
            tmp = {}

            for q in Contacts._meta.concrete_fields:
                tmp[q.name] = c[q.name]

            # print(tmp)

            contact = Contacts.objects.create(**tmp)
            break

        tmp2 = {
            'disability_id': disability.id,
            'equipment_id': equipment.id,
        }

        for q in ActivePlace._meta.concrete_fields:
            if not isinstance(q, OneToOneField):
                try:
                    key = q.name

                    if q.name == 'lat':
                        key = 'latitude'
                    elif q.name == 'lng':
                        key = 'longitude'
                    elif q.name == 'active_place_id':
                        key = 'id'

                    if item['data'][key] is not None:
                        tmp2[q.name] = item['data'][key]

                except KeyError as e:
                    # print(e)
                    continue
        # print(tmp2)
        place = ActivePlace.objects.create(**tmp2)
        place.contact = contact
        place.save()

        for a in item['data']['activities']:
            activities, created = Activity.objects.get_or_create(**a)
            place.activities.add(activities)

        for f in item['data']['facilities']:
            tmp3 = {}
            # print(f)
            for q in Facility._meta.concrete_fields:

                if q.name == 'active_place':
                    value = place
                else:
                    value = f[q.name]

                if value is not None:
                    tmp3[q.name] = value

            facility = Facility.objects.create(**tmp3)

            tmp4 = {}
            for o in f['openingTimes']:
                for q in OpeningTimes._meta.concrete_fields:

                    if q.name == 'facility':
                        value = facility
                    elif q.name == 'id':
                        continue
                    else:
                        value = o[q.name]

                    if value is not None:
                        tmp4[q.name] = value

                # print(o)
                OpeningTimes.objects.create(**tmp4)
        # break

