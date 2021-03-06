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
    """
    The main API definition.
    This method calls a series of filters. Each filter decides whether it should be performed or not
    depending on the contents of the request (data).
    :return:
    """

    if request.method == 'POST':

        # Fetch a queryset of all properties.
        queryset = Property.objects.filter(latitude__isnull=False, longitude__isnull=False)

        start = time.time()

        # Load the contents of the request
        data = json.loads(request.body)

        # Perform each of the filters on the set of properties, given the contents of the request.
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

        # Serialize the data into a dictionary format.
        print("Serializing")
        serialized_data = BasicPropertySerializer(qs, many=True).data

        # Convert the response contents into JSON.
        print("Dumping")
        response = json.dumps(
            {
                'count': qs.__len__(),
                'results': serialized_data
            }
        )

        # Print the number of queries performed to establish whether optimistions can happen.
        print(len(connection.queries))

        # Print the time taken to perform the filters, again for optimisation purposes.
        end = time.time()
        print("time: ", end - start)

        return HttpResponse(response, content_type="json")

    return Http404('Error')


def get_property(request, listing_id):
    """
    Return details for a property with a given listing_id.
    :param request:
    :param listing_id:
    :return:
    """

    # Find the property in the database or return a 404 response.
    p = get_object_or_404(Property, listing_id=listing_id)

    # Serialize the property into
    rooms_serialized = PropertyInformationSerializer(p).data

    response = json.dumps(
        rooms_serialized
    )

    return HttpResponse(response, content_type="json")


def sale_price_histogram(request):
    """
    Generate a price histogram to be displayed above the price range slider.
    :param request:
    :return:
    """
    data = get_price_histogram()

    response = json.dumps(list(data))

    return HttpResponse(response, content_type="json")


def rental_price_histogram(request):
    """
    Generate a price histogram to be displayed above the price range slider.
    :param request:
    :return:
    """
    data = get_price_histogram(listing_status="rent")

    response = json.dumps(list(data))

    return HttpResponse(response, content_type="json")