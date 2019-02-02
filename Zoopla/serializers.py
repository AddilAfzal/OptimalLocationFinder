from rest_framework import serializers

from Zoopla.models import Property, PropertyImage


# class RoomsSerializer(serializers.Serializer):
#     pass


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('url',)


class PropertySerializer(serializers.ModelSerializer):
    propertyimage_set = PropertyImageSerializer(many=True)

    class Meta:
        model = Property
        fields = ('listing_id', 'longitude', 'latitude', 'street_name', 'post_town',
                  'outcode', 'price', 'listing_status', 'details_url', 'thumbnail_url', 'propertyimage_set')
