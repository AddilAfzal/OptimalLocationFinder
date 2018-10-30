import pytz
from dateutil.relativedelta import relativedelta
from django.utils import timezone

import requests

from LocationFinder.settings import HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE


def get_directions(aX=None, aY=None, bX=None, bY=None):
    """
    Given two sets of coordinates, find routes via every mode of transport.
    :param aX:
    :param aY:
    :param bX:
    :param bY:
    :return:
    """

    aX, aY = 51.523252, -0.370472
    bX, bY = 51.527678,-0.103682

    timezone.activate(pytz.timezone("Europe/London"))

    depart_time = (timezone.now() + relativedelta(minutes=1)).isoformat()
    r = requests.get('https://transit.api.here.com/v3/route.json'
                     '?app_id=%s'
                     '&app_code=%s'
                     '&routing=all'
                     '&dep=%s,%s'
                     '&arr=%s,%s'
                     '&time=%s'% (HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE,
                                 aX, aY, bX, bY,
                                 depart_time))

    return r.json()


def get_quickest_route(aX, aY, bX, bY):
    """
    Given two sets of coordinates, find the quickest route via every mode of transport.
    :param aX:
    :param aY:
    :param bX:
    :param bY:
    :return:
    """

    # Sort the data by duration

    pass