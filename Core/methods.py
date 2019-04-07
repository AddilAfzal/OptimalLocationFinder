import json
import urllib.request
from math import radians, cos, sin, sqrt, atan2

import numpy
import requests
from scipy.spatial import KDTree


latitude, longitude = 51.524899, -0.369960


def postcode_lookup(postcodes):
    obj = { 'postcodes': postcodes}
    url = "http://api.postcodes.io/postcodes"

    req = urllib.request.Request(url)
    req.add_header('Content-Type', 'application/json')

    jsondata = json.dumps(obj)
    jsondataasbytes = jsondata.encode('utf-8')
    req.add_header('Content-Length', len(jsondataasbytes))
    print(jsondataasbytes)
    response = urllib.request.urlopen(req, jsondataasbytes)
    resp_data = json.loads(response.read())

    return resp_data['result']


def coordinates_to_postcode(lat, lon):
    url = "http://api.postcodes.io/postcodes?lon=%s&lat=%s" % (lon, lat)

    req = requests.get(url)
    data = req.json()

    return data['result'][0]['postcode']


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


def get_closest_locations(latitude, longitude, locations, k=3):

    ecef_locations = [geodetic2ecef(d['lat'], d['lng']) for d in locations]
    tree = KDTree(numpy.array(ecef_locations))

    l = geodetic2ecef(latitude, longitude)
    result = tree.query([l], k=k)

    if k == 1:
        return result

    return result


def get_closest_location(*args):
    result = get_closest_locations(*args, k=1)
    return float(result[0][0]), int(result[1][0])
