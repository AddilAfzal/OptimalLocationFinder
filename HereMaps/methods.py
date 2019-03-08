import re

import pytz
from django.utils import timezone

from tornado import ioloop, httpclient
import requests

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
