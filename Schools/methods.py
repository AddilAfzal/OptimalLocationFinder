import json
from math import radians, cos, sin, sqrt, atan2

from HereMaps.methods import get_route
from HereMaps.models import RouteCache
from Schools.filters import SchoolFilter
from Schools.models import School
import numpy
from scipy.spatial import KDTree
#
# def get_distance(lat1, lon1, lat2, lon2):
#     R = 6373.0
#
#     lat1 = radians(lat1)
#     lon1 = radians(lon1)
#     lat2 = radians(lat2)
#     lon2 = radians(lon2)
#
#     dlon = lon2 - lon1
#     dlat = lat2 - lat1
#
#     a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
#     c = 2 * atan2(sqrt(a), sqrt(1 - a))
#
#     return R * c
#
#
# def filter_properties_for_schools(data, qs):
#
#     if 'school' in data:
#         property_list = list()
#         school_radius = 0.5
#
#         # Schools that match our conditions
#         schools_location = SchoolFilter(data['school'], School.objects.all()).qs.values_list('lat', 'lng')
#
#         property_list = list()
#
#         for (i, p) in enumerate(qs):
#             for (lat, lng) in schools_location:
#                 if get_distance(lat, lng, p.latitude, p.longitude) <= school_radius:
#                     property_list.append(p)
#                     # print(i)
#                     break
#         return property_list
#     else:
#         return qs

A = 6378.137
B = 6356.7523142
ESQ = 6.69437999014 * 0.001


def geodetic2ecef(lat, lon, alt=0):
    """Convert geodetic coordinates to ECEF."""
    lat, lon = radians(lat), radians(lon)
    xi = sqrt(1 - ESQ * sin(lat))
    x = (A / xi + alt) * cos(lat) * cos(lon)
    y = (A / xi + alt) * cos(lat) * sin(lon)
    z = (A / xi * (1 - ESQ) + alt) * sin(lat)
    return x, y, z


def euclidean_distance(distance):
    """Return the approximate Euclidean distance corresponding to the
    given great circle distance (in km).

    """
    return 2 * A * sin(distance / (2 * B))


def filter_properties_for_schools(data, qs):

    if 'school' in data:
        property_list = list()
        school_radius = 0.5

        # Schools that match our conditions
        schools = SchoolFilter(data['school'], School.objects.all()).qs.values_list('lat', 'lng')

        ecef_schools = [geodetic2ecef(lat, lon) for lat, lon in schools]
        tree = KDTree(numpy.array(ecef_schools))

        for p in qs:
            l = geodetic2ecef(p.latitude, p.longitude)
            if tree.query_ball_point([l], r=euclidean_distance(school_radius))[0].__len__() > 0:
                property_list.append(p)
                # print(i)

        return property_list
    else:
        return qs


def filter_properties_by_commute(data, qs):

    if 'commute' in data:
        properties = qs[:100]

        t = RouteCache.objects.all().values()

        for l in data['commute']:
            filtered_properties = []

            text = l['text']
            position = l['position']
            required_commute_time = l['time'] * 60

            for p in properties:
                query = t.filter(start_latitude=p.latitude, start_longitude=p.longitude,
                                                  des_latitude=position[0], des_longitude=position[1])

                if query:   # If the query returns at least one item
                    cached_object = query.first()
                    print(cached_object)
                    if cached_object and cached_object['commute_time'] <= required_commute_time:   # If the commute time is within the defined max.
                        route = json.loads(cached_object['data'])
                    else:
                        continue
                else:
                    route, expected_commute_time = get_route([p.latitude, p.longitude], position)
                    if not expected_commute_time <= required_commute_time:
                        continue

                print(p)
                if hasattr(p, 'route_data'):
                    p.route_data.append(route)
                else:
                    p.route_data = [route]

                filtered_properties.append(p)

            properties = filtered_properties

        return properties

    return qs
