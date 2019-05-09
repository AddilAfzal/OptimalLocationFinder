from json import JSONDecodeError

import requests
from django.http import HttpResponse
import json

from HereMaps.methods import get_routes, get_reverse_geo_code
from HereMaps.models import ReverseGeoCodeCache
from LocationFinder.settings import HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE
from Zoopla.models import Property


def distance_api(request):
    """
    Distance filter API
    :return:
    """
    try:
        data = json.loads(request.body)
        # print(data)
        # {"by_distance": [{"lat": 0, "lng": 0, "max_distance": 20}]}

        # TODO: Create a formset to validate the data...

        # Looping over the distance restrictions as set by the user.
        to_locations = [(l['latitude'], l['longitude']) for l in data['by_distance']]
        print(to_locations)

        properties = Property.objects.filter(pk__in=data['queryset']).values('latitude', 'longitude')
        # print(properties)

        for p in properties:
            from_location = [ (p['latitude'], p['longitude']) ]

            routes = get_routes(from_location, to_locations)
            # Check that the routes satisfy the user time requirements

    except (JSONDecodeError, KeyError):
        return HttpResponse(content="Failed", status=500)

    return HttpResponse(content="success")


def reverse_geo_code(request, lat, lng):
    o = ReverseGeoCodeCache.objects.filter(latitude=lat, longitude=lng)
    if o.count() == 1:
        o = o.get()
    else:
        s = get_reverse_geo_code(lat, lng)
        o = ReverseGeoCodeCache.objects.create(latitude=lat, longitude=lng, label=s)

    response = {'label': o.label}
    return HttpResponse(json.dumps(response))


def search_input(request, search):
    """
    Call the here maps API to return auto complete sugggestions for user input.
    :return:
    """
    # r = requests.get(
    #     'http://autocomplete.geocoder.api.here.com/6.2/suggest.json'
    #     '?app_id=%s'
    #     '&app_code=%s'
    #     '&query=%s' % (HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE, search))
    r = requests.get(
        'https://places.cit.api.here.com/places/v1/autosuggest'
        '?at=51.49,-0.14'
        '&app_id=%s'
        '&app_code=%s'
        '&q=%s' % (HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE, search))

    response = r.json()
    print(response)

    return HttpResponse(json.dumps(response), content_type="json")
