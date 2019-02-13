import numpy
from scipy.spatial import KDTree
from Core.methods import geodetic2ecef


def get_closest_locations(latitude, longitude, locations):

    ecef_locations = [geodetic2ecef(d['lat'], d['lng']) for d in locations]
    tree = KDTree(numpy.array(ecef_locations))

    l = geodetic2ecef(latitude, longitude)
    result = tree.query([l], k=1)
    return float(result[0][0]), int(result[1][0])

