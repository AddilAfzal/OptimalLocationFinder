from Core.methods import geodetic2ecef, euclidean_distance
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
