from rest_framework import status, generics

from Zoopla.filters import PropertyBasicFilter
from Zoopla.models import Property
from Zoopla.serializers import PropertySerializer


class PropertiesList(generics.ListAPIView):
    model = Property
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    filter_class = PropertyBasicFilter
