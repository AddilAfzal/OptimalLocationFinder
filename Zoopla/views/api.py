import json
import time

from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, generics

from Schools.methods import filter_properties_for_schools
from Zoopla.filters import BasicPropertyFilter, RoomFilter, PriceFilter, AreaFilter
from Zoopla.models import Property
from Zoopla.serializers import PropertySerializer, RoomsSerializer
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
    queryset = Property.objects.all().prefetch_related('propertyimage_set', 'rentalprice_set')

    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)

        qs = BasicPropertyFilter(data, queryset).qs
        qs = RoomFilter(data, qs).qs
        qs = PriceFilter(data, qs).qs
        qs = AreaFilter(data, qs).qs

        start = time.time()
        qs = filter_properties_for_schools(data, qs)
        end = time.time()
        print("time: ", end - start)
        response = json.dumps(
            {
                'count': qs.__len__(),
                'results': PropertySerializer(qs, many=True).data,
            }
        )

        print(len(connection.queries))

        return HttpResponse(response, content_type="json")

    return Http404('Error')


def get_property(request, listing_id):
    p = get_object_or_404(Property, listing_id=listing_id)
    rooms_serialized = RoomsSerializer(p).data

    response = json.dumps(
        {
            'rooms': rooms_serialized,

        }
    )

    return HttpResponse(response, content_type="json")
