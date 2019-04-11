import json

from django.http import HttpResponse
from Core.methods import get_closest_locations
from Schools.models import School
from Schools.serializers import SchoolSerializer


def get_closest_schools(request, latitude, longitude):
    latitude, longitude = float(latitude), float(longitude)
    knn = 10

    schools = School.objects.values('urn', 'lat', 'lng')

    locations = get_closest_locations(latitude, longitude, schools, k=knn)
    index_list = list(locations[1][0])

    nearest_locations = [schools[int(x)]['urn'] for x in index_list]
    loc_dist = sorted(list(zip(nearest_locations, locations[0][0])), key=lambda x: x[0])

    locations_with_associations = School.objects.filter(urn__in=nearest_locations).order_by('urn')

    sorted_schools = sorted(list(zip(loc_dist, locations_with_associations)), key=lambda  x: x[0][1])

    for ((a, b), obj) in sorted_schools:
        obj.distance = b

    response_data = json.dumps(SchoolSerializer([x[1] for x in sorted_schools], many=True).data)

    return HttpResponse(
        response_data,
        content_type="json"
    )
