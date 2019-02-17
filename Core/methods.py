import json
import urllib.request
from math import radians, cos, sin, sqrt, atan2

import requests


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
