from json import JSONDecodeError

from django.http import HttpResponse
import json


def distance_api(request):
    """
    Distance filter API
    :return:
    """
    print(request.body)
    try:
        print(json.loads(request.body))
    except JSONDecodeError:
        return HttpResponse(content="Failed", status=500)

    return HttpResponse(content="success")
