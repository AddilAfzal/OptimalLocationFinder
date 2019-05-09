import json
import re
from concurrent.futures import ThreadPoolExecutor
from json import JSONDecodeError

import numpy
import pytz
from django.db.models import Q
from django.utils import timezone

import requests
from scipy.spatial import KDTree

from Core.methods import geodetic2ecef
from HereMaps.models import RouteCache
from LocationFinder.settings import HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE

# For testing purposes
start = [(51.523252, -0.370472),(51.523252, -0.310472)]
des = [(51.527678,-0.103682)]

# This method was never finished.
def get_routes(start_geo, des_geo, mode="car"):
    """
    https://developer.here.com/documentation/routing/topics/request-matrix-of-routes.html
    Given a matrix of lat, lng calculate the travel time via a chosen mode of travel.
    :return:
    """

    start_joined = ""
    for index, (lat, lng) in enumerate(start_geo):
        start_joined += "&start%s=%s,%s" % (index, lat, lng)

    des_joined = ""
    for index, (lat, lng) in enumerate(des_geo):
        des_joined += "&destination%s=%s,%s" % (index, lat, lng)

    timezone.activate(pytz.timezone("Europe/London"))

    # depart_time = (timezone.now() + relativedelta(minutes=1)).isoformat()

    if mode == 'car':
        r = requests.get('https://matrix.route.api.here.com/routing/7.2/calculatematrix.json'
                         '?app_id=%s'
                         '&app_code=%s'
                         '%s'
                         '%s'
                         '&summaryAttributes=traveltime'
                         '&mode=fastest;%s;traffic:enabled' % (
                            HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE, start_joined, des_joined, mode))

    connections = r.json()
    print(connections)
    # connections = r.json()['Res']['Connections']['Connection']
    # for c in connections:
    #     c['duration'] = extract_duration(c['duration'])

    # connections = sorted(connections, key=lambda k: k['duration'])

    return connections['response']['matrixEntry']


def extract_duration(raw_duration="PT24M"):
    """
    Given a duration in TimeDelta format, convert it into minutes.
    :param raw_duration:
    :return:
    """

    # Define the patern
    pattern = re.compile('-?P(\d+Y)?(\d+M)?(\d+D)?T((\d+H)?(\d+M)?(\d+S)?)?')

    # Perform a pattern match on the duration
    matches = pattern.match(raw_duration)

    # Extract hours and minutes.
    hours = matches.groups()[4]
    minutes = matches.groups()[5]

    total = 0

    # Accumulate duration as minutes
    if hours:
        total += 60 * int(hours[:-1])

    if minutes:
        total += int(minutes[:-1])

    return total


def get_reverse_geo_code(lat, lng):
    """
    Fetch the name of an area based on geo-coordinates.
    :param lat:
    :param lng:
    :return:
    """

    # Make the request to the HereMaps API
    r = requests.get(
        'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?'
        'app_id=%s&app_code=%s&'
        'mode=retrieveAreas&'
        'prox=%s,%s,5' % (HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE, lat, lng))

    # Extract the address.
    address_data = r.json()['Response']['View'][0]['Result'][0]['Location']['Address']

    # Extract the label and postcode.
    label = address_data['Label']
    postcode = address_data['PostalCode']

    # Format the text as one line and return.
    return "%s, %s" % (label, postcode)


def get_route(a, b, mode="publicTransport"):
    """
    Get the fastest route traveling from point a to b
    :return:
    """

    # If the transportation method is public transport
    if mode == 'publicTransport':

        # Substitute the URL parameters
        api_url = ('https://route.api.here.com/routing/7.2/calculateroute.json'
                         '?app_id=%s'
                         '&app_code=%s'
                         '&waypoint0=geo!%s'
                         '&waypoint1=geo!%s'
                         '&departure=now'
                         '&mode=fastest;publicTransport'
                         '&traffic:disabled' % (
                             HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE, "%s,%s" % (a[0], a[1]), "%s,%s" % (b[0], b[1])))

        # Make the API call.
        print(api_url)
        r = requests.get(api_url)
        print("Performing query")

        # Try and decode the response and create a database cache object.
        try:
            j = r.json()
            commute_time = j['response']["route"][0]['summary']['baseTime']
            RouteCache.objects.create(start_latitude=a[0], start_longitude=a[1],
                                      des_latitude=b[0], des_longitude=b[1],
                                      data=r.text,
                                      commute_time=commute_time)
            return j, commute_time
        except Exception as e:
            print(e)
            return None, None
        # Otherwise return an empty response.


def filter_properties_by_commute(data, qs):
    """
    Take the queryset of locations and return those that meet the commute time requirements.
    :param data:
    :param qs:
    :return:
    """
    if 'commute' in data:
        # properties = random.sample(list(qs), 100)
        # properties = qs[:300]

        # Get a list of all property coordinates from the database
        property_coordinates = qs.values('latitude', 'longitude')
        print("ECEF")

        # Convert each set of coordinates into ecef
        ecef_properties = [geodetic2ecef(x['latitude'], x['longitude']) for x in property_coordinates]
        print("Commute points")

        # Convert each POI into ecef
        commute_points = [geodetic2ecef(x['position'][0], x['position'][1]) for x in data['commute']]

        # Supply the ecef distances into the KDTree as a numpy array (for performance reasons)
        print("Tree")
        tree = KDTree(numpy.array(ecef_properties))

        # Fetch the 300 closest points to the commute points, as they will most likely have the quickest commute times.
        distance_ar, index_ar = tree.query(commute_points, k=300)
        # print(index_ar)

        # Map over the list of indexes, converting back to int
        print("Extracting points to list")
        index_ar = list((map(int, index_ar[0].tolist() )))

        # Convert the queryset into a numpy array and fetch elements at given index. (quicker with numpy array)
        print("Index to properties")
        numpy_qs = numpy.array(qs)
        properties = [numpy_qs[i] for i in index_ar]

        # For each POI as defined in the commute filter.
        for l in data['commute']:
            properties_filtered = []
            properties_left = properties

            # Define variables for substitution
            text = l['text']
            position = l['position']
            required_commute_time = l['time'] * 60

            route_requests = []

            conditions = Q()

            # Accumulate conditions
            print("Accumulating")
            for p in properties:
                conditions |= (Q(start_latitude=p.latitude, start_longitude=p.longitude,
                                 des_latitude=position[0], des_longitude=position[1]))

            # Find previously checked properties meeting conditions in the database.
            cache_query = RouteCache.objects.filter(conditions).values()
            for route_cache in cache_query:
                # Find the property that corresponds with the cache object.
                p = list(filter(lambda p: p.latitude == route_cache['start_latitude'] and
                                 p.longitude == route_cache['start_longitude'], properties_left))

                if p:
                    # If found, remove from the list of properties to check
                    p = p[0]
                    properties_left.remove(p)

                    # Check whether the commute time meets the users needs.
                    if route_cache['commute_time'] <= required_commute_time:
                        # If it does, add the route data to the property object for sending to the front-end later.
                        data = json.loads(route_cache['data'])
                        if hasattr(p, 'route_data'):
                            p.route_data.append(data)
                        else:
                            p.route_data = [data]

                        properties_filtered.append(p)

            # For each of the properties which do not have a cache route object, a API call is performed.
            for p in properties_left:
                # Append each property to check into a list.
                route_requests.append([
                    p,
                    position,
                    required_commute_time,
                ])

            # Call the HereMaps API, performing the task on multiple threads, asynchronously
            with ThreadPoolExecutor(max_workers=50) as pool:
                # Remove None values. None value is returned by properties that don't meet the commute time required.
                properties = list(filter(None, list(pool.map(get_route_data, route_requests))))
                # Append to list of filtered properties.
                properties += properties_filtered

        return properties

    return qs


def get_route_data(data):
    """
    Given a property (location), call the HereMaps API to retrieve an estimated commute to a point (position).
    If the time falls below the threshold (required_commute_time) then append the route data to the location and return.
    :param data:
    :return:
    """

    # Extract the parameters
    location, position, required_commute_time = data

    # Perform API call.
    route, expected_commute_time = get_route([location.latitude, location.longitude], position)

    # If a commute time is returned, and not None.
    if expected_commute_time:
        # Check whether the estimated commute time meets the commute time needs.
        if expected_commute_time <= required_commute_time:
            # If so, append route data to property object.
            if hasattr(location, 'route_data'):
                location.route_data.append(route)
            else:
                location.route_data = [route]

            return location
