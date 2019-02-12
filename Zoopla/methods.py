import json
import numpy

import pytz
import requests
import xmltodict
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.utils import timezone

from LocationFinder.settings import ZOOPLA_API_KEY
from Zoopla.models import ZooplaQuery, Property, Agent, PropertyImage, PriceHistory, RentalPrice

tz_london = pytz.timezone('Europe/London')


def search_properties(area, listing_status, radius=1, min_price=None, max_price=None, furnished=None,
                      property_type=None):
    """
    Search for a property listing
    :param area:
    :param listing_status: 'sale' or 'rent'
    :param radius: in miles
    :param min_price: Sale -> Total price / Rent -> per week cost
    :param max_price: Sale -> Total price / Rent -> per week cost
    :param furnished:
    :param property_type: house or flat
    :return:
    """

    price_filters = Q()

    if max_price:
        price_filters &= Q(maximum_price__lte=max_price)

    if min_price:
        price_filters &= Q(minimum_price__gte=min_price)

    query = ZooplaQuery.objects.filter(
        price_filters,
        area=area,
        listing_status=listing_status,
        radius=radius, created__gte=timezone.now() - relativedelta(days=2))

    if not query:
        url = "https://api.zoopla.co.uk/api/v1/property_listings?" \
              "api_key=%s" \
              "&area=%s" \
              "&radius=%s" \
              "&page_size=100" \
              "&listing_status=%s" \
              % (ZOOPLA_API_KEY, area, radius, listing_status)

        url += "&minimum_price=%s" % min_price if min_price else ''
        url += "&maximum_price=%s" % max_price if max_price else ''
        # url += "&furnished=%s" % furnished if furnished else '' // only applies to rental
        url += "&property_type=%s" % property_type if property_type else ''

        r = requests.get(url)

        response_dict = xmltodict.parse(r.content)
        response_json = json.dumps(response_dict)

        # Insert the query into the database
        zoopla_query = ZooplaQuery.objects.create(
            minimum_price=min_price,
            maximum_price=max_price,
            area=area,
            listing_status=listing_status,
            radius=radius,
            results=response_json,
            # number_of_results=response_dict['response']['listing'].__len__()
            number_of_results=response_dict['response']['result_count'],
        )

        listing_id_timestamps = [(val['listing_id'], val['last_published_date']) for val in
                                 response_dict['response']['listing']]

        condition = Q()

        for (id, timestamp) in listing_id_timestamps:
            condition |= Q(listing__id=id) & Q(last_published=datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S"))

        listing_ids, a = zip(*listing_id_timestamps)
        existing_listing_ids = list(
            Property.objects.filter(condition).values_list('listing_id', flat=True))
        new_listing_ids = set(listing_ids) - set(existing_listing_ids)
        print(new_listing_ids)

        for p in response_dict['response']['listing']:
            if p['listing_id'] in new_listing_ids:
                property_instance, updated = Property.objects.update_or_create(

                )

        return zoopla_query

    else:
        return query.first()

london_postcode_districts = [
    # 'UB',
    # 'CR',
    # 'EN',
    # 'EC',
    # 'BR',
    # 'DA',
    # 'KT',
    # 'TW',
    # 'TN',
    # 'WD',
    # 'RM',
    # 'HA', # Re-do everything above
    # 'SM',
    #
    # 'E1',
    # 'E2',
    # 'E3',
    # 'E4',
    # 'E5',
    # 'E6',
    # 'E7',
    # 'E8',
    # 'E9',
    # 'E10',
    # 'E11',
    # 'E12',
    # 'E13',
    # 'E14',
    # 'E15',
    # 'E16',
    # 'E17',
    # 'E18',
    #
    # 'N1',
    # 'N2',
    # 'N3',
    # 'N4',
    # 'N5',
    # 'N6',
    # 'N7',
    # 'N8',
    # 'N9',
    # 'N10',
    # 'N11',
    # 'N12',
    # 'N13',
    # 'N14',
    # 'N15',
    # 'N16',
    # 'N17',
    # 'N18',
    # 'N19',
    # 'N20',
    # 'N21',
    # 'N22',

    # 'W1',
    # 'W2',
    # 'W3',
    # 'W4',
    # 'W5',
    # 'W6',
    # 'W7',
    # 'W8',
    # 'W9',
    # 'W10',
    # 'W11',
    # 'W12',
    # 'W13',
    # 'W14',

    # 'NW1',
    # 'NW2',
    # 'NW3',
    # 'NW4',
    # 'NW5',
    # 'NW6',
    # 'NW7',
    # 'NW8',
    # 'NW9',
    # 'NW10',
    # 'NW11',
    #
    # 'SW1',
    # 'SW2',
    # 'SW3',
    # 'SW4',
    # 'SW5',
    # 'SW6',
    # 'SW7',
    # 'SW8',
    # 'SW9',
    # 'SW10',
    # 'SW11',
    # 'SW12',
    # 'SW13',
    # 'SW14',
    # 'SW15',
    # 'SW16',
    # 'SW17',
    # 'SW18',
    # 'SW19',
    # 'SW20',
    #
    # 'SE1',
    # 'SE2',
    # 'SE3',
    # 'SE4',
    # 'SE5',
    # 'SE6',
    # 'SE7',
    # 'SE8',
    # 'SE9',
    # 'SE10',
    # 'SE11',
    # 'SE12',
    # 'SE13',
    # 'SE14',
    # 'SE15',
    # 'SE16',
    # 'SE17',
    # 'SE18',
    # 'SE19',
    # 'SE20',
    # 'SE21',
    # 'SE22',
    # 'SE23',
    # 'SE24',
    # 'SE25',
    # 'SE26',
    # 'SE27',
    # 'SE28',

]


def results_counter():
    base_page_url = "https://api.zoopla.co.uk/api/v1/property_listings?&api_key=e9gkxstnn2jq4d7njqz2mnw4&page_size=100&order_by=age&ordering=ascending&area="
    i = 0

    for p in london_postcode_districts:
        try:
            api_url = base_page_url + p
            r = requests.get(api_url)
            response_dict = xmltodict.parse(r.content)

            i += int(response_dict['response']['result_count'])
            print("total: %s, %s: %s  " % (i, p, response_dict['response']['result_count']))
        except Exception as e:
            print(e)
            continue


def data_grabber():
    base_page_url = "https://api.zoopla.co.uk/api/v1/property_listings?api_key=89uuaawpyfug8cfhykvgzdbu&page_size=100&order_by=age&ordering=ascending"

    page = 9

    api_keys = ['89uuaawpyfug8cfhykvgzdbu', 'wkq3yqmcsj45kfmpat4mwepr']

    limitted = False
    try:
        for postcode in london_postcode_districts:
            while True:
                page_url = base_page_url + ("&page_number=%s&area=%s" % (page, postcode))
                r = requests.get(page_url)
                print(page_url)

                if not r.status_code == 200:
                    print("Over rate...")
                    print(page_url)
                    print('Postcode: %s  I: %s' % (postcode, page) )
                    limitted = True
                    break
                    # raise Exception('Postcode: %s  I: %s' % (postcode, page) )

                try:
                    response_dict = xmltodict.parse(r.content)
                except Exception as e:
                    print("Parse error on page %s" % page)
                    page += 1
                    continue

                response_json = json.dumps(response_dict)

                zoopla_query = ZooplaQuery.objects.create(
                    minimum_price=0,
                    maximum_price=0,
                    area="london",
                    listing_status="-",
                    radius=0,
                    results=response_json,
                    # number_of_results=response_dict['response']['listing'].__len__()
                    number_of_results=response_dict['response']['result_count'],
                )

                x = 0
                try:
                    for p in response_dict['response']['listing']:

                        try:
                            agent, created = Agent.objects.get_or_create(
                                agent_address__iexact=p['agent_address'],
                                defaults={
                                    'agent_logo': p['agent_logo'],
                                    'agent_name': p['agent_name'],
                                    'agent_phone': p['agent_phone'],
                                }
                            )

                            property_instance, property_created = Property.objects.update_or_create(
                                listing_id=p['listing_id'],
                                defaults={
                                    'category': p['category'],
                                    'county': p['county'],
                                    'description': p['description'],
                                    'details_url': p['details_url'],
                                    'first_published': timezone.datetime.fromtimestamp(
                                        timezone.datetime.strptime(p['first_published_date'], '%Y-%m-%d %H:%M:%S').timestamp(),
                                        tz=tz_london),
                                    'last_published': timezone.datetime.fromtimestamp(
                                        timezone.datetime.strptime(p['last_published_date'], '%Y-%m-%d %H:%M:%S').timestamp(),
                                        tz=tz_london),
                                    'furnished_state': "Unfurnished" if p['furnished_state'] == None else p['furnished_state'],
                                    'latitude': p['latitude'],
                                    'longitude': p['longitude'],
                                    'listing_status': p['listing_status'],
                                    'num_bathrooms': p['num_bathrooms'],
                                    'num_bedrooms': p['num_bedrooms'],
                                    'num_floors': p['num_floors'],
                                    'num_recepts': p['num_recepts'],
                                    'outcode': p['outcode'],
                                    'post_town': p['post_town'],
                                    'price': p['price'],
                                    'property_type': p['property_type'],
                                    'short_description': p['short_description'],
                                    'status': p['status'],
                                    'street_name': p['street_name'],
                                    'thumbnail_url': p['thumbnail_url'],
                                    'agent': agent,
                                }
                            )

                            property_instance.zoopla_query.add(zoopla_query)
                            p_dict = dict(p)

                            if 'rental_prices' in p_dict:
                                rp = RentalPrice.objects.create(
                                    accurate=p_dict['rental_prices']['accurate'],
                                    per_month=p_dict['rental_prices']['per_month'],
                                    per_week=p_dict['rental_prices']['per_week'],
                                    shared_occupancy=p_dict['rental_prices']['shared_occupancy'],
                                    zoopla_property=property_instance,
                                )

                            if 'price_change' in p_dict:
                                for price_change in p_dict['price_change']:
                                    try:
                                        ph = PriceHistory.objects.create(
                                            zoopla_property=property_instance,
                                            date_changed=timezone.datetime.fromtimestamp(
                                                timezone.datetime.strptime(price_change['date'], '%Y-%m-%d %H:%M:%S').timestamp(),
                                                tz=tz_london),
                                            price=price_change['price'],
                                            percent=price_change['percent'][:-1]
                                        )
                                    except TypeError as e:
                                        pass

                            if 'image_url' in p_dict and p_dict['image_url']:
                                image, created = PropertyImage.objects.get_or_create(
                                    url=p['image_url'],
                                    zoopla_property=property_instance
                                )

                            x += 1
                            print(x)
                        except Exception as e:
                            print(e)
                            print(p)
                            #print(p_dict)
                            break

                    print("Page %s complete" % page)
                    page += 1
                except KeyError:
                    break

            page = 1
            if limitted:
                break

    except Exception as e:
        print(e)


def data_scrapper():
    import re
    location_regex = r'/<img data-src="https:\/\/maps\.google\.com\/maps\/api\/staticmap\?.*center&#x3D;((?:[-]*[0-9]|\.)*[0-9]*),[-]*((?:[0-9]|\.)*[0-9]*)/gm'


def price_range_frequency():
    p = Property.objects.filter(listing_status="sale").exclude(price=0).order_by('price')
    values = []

    for a in p:
        values.append({

        })


def get_sale_price_histogram():
    prices = Property.objects.filter(listing_status="sale")\
        .exclude(price=0)\
        .values_list('price')\
        .order_by('price')

    q = numpy.histogram(prices, bins=numpy.arange(0, 1500000, 50000))

    tmp = []
    for (r, v) in zip(map(int, q[1]), map(int,q[0])):
        tmp.append({'price': r, 'value': v})

    return tmp
