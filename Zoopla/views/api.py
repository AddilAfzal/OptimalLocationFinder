import json
import numpy
import time

import requests
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, generics

from LocationFinder.settings import HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE
from Schools.methods import filter_properties_for_schools
from HereMaps.methods import filter_properties_by_commute
from Zoopla.filters import BasicPropertyFilter, RoomFilter, PriceFilter, AreaFilter
from Zoopla.methods import get_price_histogram
from Zoopla.models import Property
from Zoopla.serializers import BasicPropertySerializer, PropertyInformationSerializer
from django.db import connection
from tornado import ioloop
from tornado.httpclient import AsyncHTTPClient


# class PropertiesList(generics.ListAPIView):
#     model = Property
#     queryset = Property.objects.all()
#     serializer_class = PropertySerializer
#
#     def filter_queryset(self, queryset):
#         qs = BasicPropertyFilter(self.request.GET, queryset).qs
#         qs = RoomFilter(self.request.GET, qs).qs
#         qs = PriceFilter(self.request.GET, qs).qs
#         return qs
#
#     def post(self):
#         print("test")

@csrf_exempt
def property_api(request):
    queryset = Property.objects.filter(latitude__isnull=False, longitude__isnull=False)
        #.prefetch_related('propertyimage_set', 'rentalprice_set')

    if request.method == 'POST':
        start = time.time()
        data = json.loads(request.body)
        print(data)

        print("Basic filter")
        qs = BasicPropertyFilter(data, queryset).qs
        qs = RoomFilter(data, qs).qs
        print("Price filter")
        qs = PriceFilter(data, qs).qs
        print("Area filter")
        qs = AreaFilter(data, qs).qs.distinct()
        print("School filter")
        qs = filter_properties_for_schools(data, qs)
        print("Commute filter")
        qs = filter_properties_by_commute(data, qs)

        print("Serializing")
        serialized_data = BasicPropertySerializer(qs, many=True).data
        # print("data", qs)
        print("Dumping")
        response = json.dumps(
            {
                'count': qs.__len__(),
                'results': serialized_data
            }
        )

        print(len(connection.queries))
        end = time.time()
        print("time: ", end - start)

        return HttpResponse(response, content_type="json")

    return Http404('Error')


def get_property(request, listing_id):
    p = get_object_or_404(Property, listing_id=listing_id)
    rooms_serialized = PropertyInformationSerializer(p).data

    response = json.dumps(
        rooms_serialized
    )

    return HttpResponse(response, content_type="json")


def sale_price_histogram(request):
    data = get_price_histogram()

    response = json.dumps(list(data))

    return HttpResponse(response, content_type="json")


def rental_price_histogram(request):
    data = get_price_histogram(listing_status="rent")

    response = json.dumps(list(data))

    return HttpResponse(response, content_type="json")