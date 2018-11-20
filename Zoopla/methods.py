import json

import requests
import xmltodict
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.utils import timezone
from datetime import datetime

from LocationFinder.settings import ZOOPLA_API_KEY
from Zoopla.models import ZooplaQuery, Property


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

