import json
import re
from concurrent.futures import ThreadPoolExecutor

import numpy
import pytz
from django.db.models import Q
from django.utils import timezone

import requests
from scipy.spatial import KDTree

from Core.methods import geodetic2ecef
from HereMaps.models import RouteCache
from LocationFinder.settings import HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE


start = [(51.523252, -0.370472),(51.523252, -0.310472)]
des = [(51.527678,-0.103682)]


def get_routes(start_geo, des_geo, mode="car"):
    """
    https://developer.here.com/documentation/routing/topics/request-matrix-of-routes.html
    Given a matrix of lat, lng calculate the travel time via a chosen mode of travel.
    :return:
    """
    # TODO: Optimise

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


# def get_quickest_transit_route(aX=None, aY=None, bX=None, bY=None):
#     """
#     Given two sets of coordinates, find the quickest route via every mode of transport.
#     :param aX:
#     :param aY:
#     :param bX:
#     :param bY:
#     :return:
#     """
#     aX, aY = 51.523252, -0.370472
#     bX, bY = 51.527678,-0.103682
#
#     directions = get_quickest_route(aX, aY, bX, bY)
#
#     return directions


def extract_duration(raw_duration="PT24M"):
    """
    Given a duration in TimeDelta format, convert it into minutes.
    :param raw_duration:
    :return:
    """
    pattern = re.compile('-?P(\d+Y)?(\d+M)?(\d+D)?T((\d+H)?(\d+M)?(\d+S)?)?')
    matches = pattern.match(raw_duration)

    hours = matches.groups()[4]
    minutes = matches.groups()[5]

    total = 0

    if hours:
        total += 60 * int(hours[:-1])

    if minutes:
        total += int(minutes[:-1])

    return total


def get_reverse_geo_code(lat, lng):
    r = requests.get(
        'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?'
        'app_id=%s&app_code=%s&'
        'mode=retrieveAreas&'
        'prox=%s,%s,5' % (HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE, lat, lng))
    address_data = r.json()['Response']['View'][0]['Result'][0]['Location']['Address']
    label = address_data['Label']
    postcode = address_data['PostalCode']
    return "%s, %s" % (label, postcode)


def get_route(a, b, mode="publicTransport"):
    """
    Get the fastest route traveling from point a to b
    :return:
    """
    if mode == 'publicTransport':
        api_url = ('https://route.api.here.com/routing/7.2/calculateroute.json'
                         '?app_id=%s'
                         '&app_code=%s'
                         '&waypoint0=geo!%s'
                         '&waypoint1=geo!%s'
                         '&departure=now'
                         '&mode=fastest;publicTransport'
                         '&combineChange=true' % (
                             HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE, "%s,%s" % (a[0], a[1]), "%s,%s" % (b[0], b[1])))
        print(api_url)
        r = requests.get(api_url)
        j = r.json()
        commute_time = j['response']["route"][0]['summary']['baseTime']
        RouteCache.objects.create(start_latitude=a[0], start_longitude=a[1],
                                  des_latitude=b[0], des_longitude=b[1],
                                  data=r.text,
                                  commute_time=commute_time)
        return j, commute_time


def filter_properties_by_commute(data, qs):

    if 'commute' in data:
        # properties = random.sample(list(qs), 100)
        # properties = qs[:300]

        property_coordinates = qs.values('latitude', 'longitude')
        print("ECEF")
        ecef_properties = [geodetic2ecef(x['latitude'], x['longitude']) for x in property_coordinates]
        print("Commute points")
        commute_points = [geodetic2ecef(x['position'][0], x['position'][1]) for x in data['commute']]

        print("Tree")
        tree = KDTree(numpy.array(ecef_properties))
        distance_ar, index_ar = tree.query(commute_points, k=300)
        # print(index_ar)
        print("Extracting points to list")
        index_ar = list((map(int, index_ar[0].tolist() )))
        print("Index to properties")
        numpy_qs = numpy.array(qs)
        properties = [numpy_qs[i] for i in index_ar]

        for l in data['commute']:
            properties_filtered = []
            properties_left = properties

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

            cache_query = RouteCache.objects.filter(conditions).values()
            for route_cache in cache_query:
                p = list(filter(lambda p: p.latitude == route_cache['start_latitude'] and
                                 p.longitude == route_cache['start_longitude'], properties_left))

                if p:
                    p = p[0]
                    properties_left.remove(p)

                    if route_cache['commute_time'] <= required_commute_time:
                        data = json.loads(route_cache['data'])
                        if hasattr(p, 'route_data'):
                            p.route_data.append(data)
                        else:
                            p.route_data = [data]

                        properties_filtered.append(p)

            for p in properties_left:
                route_requests.append([
                    p,
                    position,
                    required_commute_time,
                ])

            with ThreadPoolExecutor(max_workers=50) as pool:
                properties = list(filter(None, list(pool.map(get_route_data, route_requests))))
                properties += properties_filtered

        return properties

    return qs


def get_route_data(data):
    location, position, required_commute_time = data
    query = RouteCache.objects.filter(start_latitude=location.latitude, start_longitude=location.longitude,
                     des_latitude=position[0], des_longitude=position[1]).values()

    # if query:  # If the query returns at least one item
    #     cached_object = query.first()
    #     if cached_object and cached_object[
    #         'commute_time'] <= required_commute_time:  # If the commute time is within the defined max.
    #         route = json.loads(cached_object['data'])
    #     else:
    #         return None
    # else:
    route, expected_commute_time = get_route([location.latitude, location.longitude], position)
    if not expected_commute_time <= required_commute_time:
        return None

    if hasattr(location, 'route_data'):
        location.route_data.append(route)
    else:
        location.route_data = [route]

    return location
