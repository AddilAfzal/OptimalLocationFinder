import json
from concurrent.futures import ThreadPoolExecutor

from Core.methods import geodetic2ecef, euclidean_distance
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
        # properties = random.sample(list(qs), 100)
        # properties = qs[:300]

        property_coordinates = qs.values('latitude', 'longitude')
        ecef_properties = [geodetic2ecef(x['latitude'], x['longitude']) for x in property_coordinates]

        commute_points = [geodetic2ecef(x['position'][0], x['position'][1]) for x in data['commute']]

        tree = KDTree(numpy.array(ecef_properties))
        distance_ar, index_ar = tree.query(commute_points, k=300)
        # print(index_ar)
        index_ar = list((map(int, index_ar[0].tolist() )))
        properties = [qs[i] for i in index_ar]
        print(properties)

        for l in data['commute']:

            text = l['text']
            position = l['position']
            required_commute_time = l['time'] * 60

            route_requests = []

            for p in properties:
                route_requests.append([
                    p,
                    position,
                    required_commute_time,
                ])

            with ThreadPoolExecutor(max_workers=50) as pool:
                properties = list(filter(None, list(pool.map(get_route_data, route_requests))))

        return properties

    return qs


def get_route_data(data):
    location, position, required_commute_time = data
    t = RouteCache.objects.all().values()
    query = t.filter(start_latitude=location.latitude, start_longitude=location.longitude,
                     des_latitude=position[0], des_longitude=position[1])

    if query:  # If the query returns at least one item
        cached_object = query.first()
        if cached_object and cached_object[
            'commute_time'] <= required_commute_time:  # If the commute time is within the defined max.
            route = json.loads(cached_object['data'])
        else:
            return None
    else:
        route, expected_commute_time = get_route([location.latitude, location.longitude], position)
        if not expected_commute_time <= required_commute_time:
            return None

    if hasattr(location, 'route_data'):
        location.route_data.append(route)
    else:
        location.route_data = [route]

    return location
