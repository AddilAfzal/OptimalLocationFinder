from rest_framework import status, generics

from Zoopla.filters import BasicPropertyFilter, RoomFilter
from Zoopla.models import Property
from Zoopla.serializers import PropertySerializer


class PropertiesList(generics.ListAPIView):
    model = Property
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

    def filter_queryset(self, queryset):
        qs = BasicPropertyFilter(self.request.GET, queryset).qs
        qs = RoomFilter(self.request.GET, qs).qs
        return qs

