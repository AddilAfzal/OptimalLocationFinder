import json

from django.http import Http404, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, generics

from Zoopla.filters import BasicPropertyFilter, RoomFilter, PriceFilter
from Zoopla.models import Property
from Zoopla.serializers import PropertySerializer


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
    queryset = Property.objects.all()

    if request.method == 'POST':
        data = json.loads(request.body)
        print(request.body)

        qs = BasicPropertyFilter(data, queryset).qs
        qs = RoomFilter(data, qs).qs
        qs = PriceFilter(data, qs).qs

        response = json.dumps(
            {
                'count': qs.count(),
                'results': PropertySerializer(qs, many=True).data,
            }
        )

        return HttpResponse(response, content_type="json")

    return Http404('Error')
