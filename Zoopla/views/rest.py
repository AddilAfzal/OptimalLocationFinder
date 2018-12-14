from rest_framework import status, generics

from Zoopla.models import Property
from Zoopla.serializers import PropertySerializer


class PropertiesList(generics.ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer