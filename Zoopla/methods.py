import json

import pytz
import requests
import xmltodict
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.utils import timezone


from LocationFinder.settings import ZOOPLA_API_KEY
from Zoopla.models import ZooplaQuery, Property, Agent, PropertyImage, PriceHistory

timezone.activate(pytz.timezone('Europe/London'))

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
        radius=radius, created__gte=timezone.now()-relativedelta(days=1))

    if not query:
        url = "https://api.zoopla.co.uk/api/v1/property_listings?" \
              "api_key=%s" \
              "&area=%s" \
              "&radius=%s" \
              "&page_size=100" \
              "&listing_status=%s"\
                % (ZOOPLA_API_KEY, area, radius, listing_status)

        url += "&minimum_price=%s" % min_price if min_price else ''
        url += "&maximum_price=%s" % max_price if max_price else ''
        # url += "&furnished=%s" % furnished if furnished else '' // TODO: finish -- only applies to rental
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


def data_grabber(
        api="https://api.zoopla.co.uk/api/v1/property_listings?area=london&api_key=sq3hgvxq9tf3fqyu8mgypnx7&page_size=100&order_by=age&ordering=ascending&page_number=2"):

    r = requests.get(api)

    response_dict = xmltodict.parse(r.content)
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
    for p in response_dict['response']['listing']:

        agent, created = Agent.objects.get_or_create(
            agent_address__iexact=p['agent_address'],
            defaults={
                'agent_logo': p['agent_logo'],
                'agent_name': p['agent_name'],
                'agent_phone': p['agent_phone'],
            }
        )

        property_instance = Property.objects.create(
            agent=agent,
            category=p['category'],
            county=p['county'],
            description=p['description'],
            details_url=p['details_url'],
            first_published=timezone.datetime.strptime(p['first_published_date'], '%Y-%m-%d %H:%M:%S'),
            last_published=timezone.datetime.strptime(p['last_published_date'], '%Y-%m-%d %H:%M:%S'),
            furnished_state="Unfurnished" if p['furnished_state'] == None else p['furnished_state'],
            latitude=p['latitude'],
            longitude=p['longitude'],
            listing_id=p['listing_id'],
            listing_status=p['listing_status'],
            num_bathrooms=p['num_bathrooms'],
            num_bedrooms=p['num_bedrooms'],
            num_floors=p['num_floors'],
            num_recepts=p['num_recepts'],
            outcode=p['outcode'],
            post_town=p['post_town'],
            price=p['price'],
            property_type=p['property_type'],
            short_description=p['short_description'],
            status=p['status'],
            street_name=p['street_name'],
            thumbnail_url=p['thumbnail_url'],
        )

        property_instance.zoopla_query.add(zoopla_query)
        p_dict = dict(p)

        if 'price_change' in p_dict:
            print("Adding price changes")
            print(p_dict['price_change'])
            for price_change in p_dict['price_change']:
                try:
                    ph = PriceHistory.objects.create(
                        zoopla_property=property_instance,
                        date_changed=timezone.datetime.strptime(price_change['date'], '%Y-%m-%d %H:%M:%S'),
                        price=price_change['price'],
                        percent=price_change['percent'][:-1]
                    )
                except TypeError as e:
                    print("Error")
                    print(e)
                    print(price_change)

        if 'image_url' in p_dict and p_dict['image_url']:
            image, created = PropertyImage.objects.get_or_create(
                url=p['image_url'],
                zoopla_property=property_instance
            )

        x += 1
        print(x)