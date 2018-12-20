from json import JSONDecodeError

from django.http import HttpResponse
import json

from HereMaps.methods import get_routes
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
