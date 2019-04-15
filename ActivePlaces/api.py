import json

from django.http import HttpResponse
from ActivePlaces.models import ActivePlace
from ActivePlaces.serializers import ActivePlaceSerializer
from Core.methods import get_closest_locations


def get_active_places(request, latitude, longitude):
    """
    Using the URL parameters, return the 6 nearest locations to the coordinates.
    :param request:
    :param latitude:
    :param longitude:
    :return:
    """
    latitude, longitude = float(latitude), float(longitude)
    knn = 6

    active_places = ActivePlace.objects\
        .exclude(nursery=True)\
        .exclude(name__icontains="school")\
        .exclude(ownerType="Community School")\
        .exclude(name__icontains="(CLOSED)")\
        .values('active_place_id', 'lat', 'lng')

    # Call the generic method to find the nearest locations. A list of indexes will be returned, with distances.
    locations = get_closest_locations(latitude, longitude, active_places, k=knn)

    # Extract the indexes
    index_list = list(locations[1][0])

    # Convert index to active_place_id
    nearest_locations = [active_places[int(x)]['active_place_id'] for x in index_list]

    # Combine ids with distances, and order based on id.
    loc_dist = sorted(list(zip(nearest_locations, locations[0][0])), key=lambda x: x[0])

    # Fetch all the data for only the 6 nearest locations, will be displayed on front-end
    locations_with_associations = ActivePlace.objects.filter(pk__in=nearest_locations)\
        .prefetch_related('activities', 'facility_set', 'facility_set__openingtimes_set', 'disability')

    # Associate indexes with their corresponding data objects and distances. Sort by distance ascending.
    sorted_locations = sorted(list(zip(loc_dist, locations_with_associations)), key=lambda  x: x[0][1])

    # Re-structure that data for serialization
    for ((a, b), obj) in sorted_locations:
        obj.distance = b

    # Serialize and convert to JSON.
    response_data = json.dumps(ActivePlaceSerializer([x[1] for x in sorted_locations], many=True).data)

    return HttpResponse(
        response_data,
        content_type="json"
    )
