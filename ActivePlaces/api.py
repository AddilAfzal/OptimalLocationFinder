import json

from django.http import HttpResponse

from ActivePlaces.models import ActivePlace
from ActivePlaces.serializers import ActivePlaceSerializer
from Core.methods import get_closest_locations


def get_active_places(request, latitude, longitude):
    latitude, longitude = float(latitude), float(longitude)
    knn = 5

    active_places = ActivePlace.objects\
        .exclude(nursery=True)\
        .exclude(name__icontains="school")\
        .exclude(ownerType="Community School")\
        .exclude(name__icontains="(CLOSED)")\
        .values('active_place_id', 'lat', 'lng')

    locations = get_closest_locations(latitude, longitude, active_places, k=knn)
    index_list = list(locations[1][0])

    nearest_locations = [active_places[int(x)]['active_place_id'] for x in index_list]
    locations_with_associations = ActivePlace.objects.filter(pk__in=nearest_locations)

    response_data = json.dumps(ActivePlaceSerializer(locations_with_associations, many=True).data)

    return HttpResponse(
        response_data,
        content_type="json"
    )
