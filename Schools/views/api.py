import json

from django.http import HttpResponse
from Core.methods import get_closest_locations
from Schools.models import School
from Schools.serializers import SchoolSerializer


def get_closest_schools(request, latitude, longitude):
    """
    Using the URL parameters, return the 10 nearest locations to the coordinates.
    :param request:
    :param latitude:
    :param longitude:
    :return:
    """
    latitude, longitude = float(latitude), float(longitude)
    knn = 10

    schools = School.objects.values('urn', 'lat', 'lng')

    # Call the generic method to find the nearest locations. A list of indexes will be returned, with distances.
    locations = get_closest_locations(latitude, longitude, schools, k=knn)

    # Extract the indexes
    index_list = list(locations[1][0])

    # Convert index to urn
    nearest_locations = [schools[int(x)]['urn'] for x in index_list]

    # Combine urns with distances, and order based on urn.
    loc_dist = sorted(list(zip(nearest_locations, locations[0][0])), key=lambda x: x[0])

    # Fetch all the data for only the 10 nearest locations, will be displayed on front-end
    locations_with_associations = School.objects.filter(urn__in=nearest_locations).order_by('urn')

    # Associate indexes with their corresponding data objects and distances. Sort by distance ascending.
    sorted_schools = sorted(list(zip(loc_dist, locations_with_associations)), key=lambda  x: x[0][1])

    # Re-structure that data for serialization
    for ((a, b), obj) in sorted_schools:
        obj.distance = b

    # Serialize and convert to JSON.
    response_data = json.dumps(SchoolSerializer([x[1] for x in sorted_schools], many=True).data)

    return HttpResponse(
        response_data,
        content_type="json"
    )
