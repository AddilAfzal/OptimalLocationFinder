import json
import urllib.request
from math import radians, cos, sin, sqrt, atan2

import numpy
import requests
from scipy.spatial import KDTree


latitude, longitude = 51.524899, -0.369960


def postcode_lookup(postcodes):
    """
    Convert a list of postcodes to geo-coordinates.
    :param postcodes:
    :return:
    """

    # Structure the data for conversion to JSON.
    obj = { 'postcodes': postcodes}
    url = "http://api.postcodes.io/postcodes"

    # Create the request object
    req = urllib.request.Request(url)
    req.add_header('Content-Type', 'application/json')

    # Convert the request data to JSON and encode as UTF-8
    jsondata = json.dumps(obj)
    jsondataasbytes = jsondata.encode('utf-8')

    # Add content length as header.
    req.add_header('Content-Length', len(jsondataasbytes))

    # Make the request and receive response.
    response = urllib.request.urlopen(req, jsondataasbytes)

    # Decode the response from JSON to a dictionary.
    resp_data = json.loads(response.read())
    
    return resp_data['result']


def coordinates_to_postcode(lat, lon):
    """
    Call an external API to convert a set of coordinates to a postcode.
    :param lat:
    :param lon:
    :return:
    """

    # Substitute coordinate.
    url = "http://api.postcodes.io/postcodes?lon=%s&lat=%s" % (lon, lat)

    # Make the request
    req = requests.get(url)

    # Decode the request as a dictionary from JSON
    data = req.json()

    # Return the first result
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
    """
    Given coordinates, find the nearest locations.
    :param latitude:
    :param longitude:
    :param locations:
    :param k:
    :return:
    """

    # Convert to ecef
    ecef_locations = [geodetic2ecef(d['lat'], d['lng']) for d in locations]

    # Create tree
    tree = KDTree(numpy.array(ecef_locations))

    # Convert location coordinates to ecef
    l = geodetic2ecef(latitude, longitude)

    # Retrieve the k nearest nodes/locations
    result = tree.query([l], k=k)

    return result


def get_closest_location(*args):
    result = get_closest_locations(*args, k=1)
    return float(result[0][0]), int(result[1][0])
