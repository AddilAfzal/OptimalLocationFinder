from rest_framework import serializers

from Zoopla.models import Property

# class RoomsSerializer(serializers.Serializer):
#     pass


class PropertySerializer(serializers.ModelSerializer):

    class Meta:
        model = Property
        fields = ('listing_id', 'longitude', 'latitude', 'street_name', 'outcode', 'price', 'details_url')
