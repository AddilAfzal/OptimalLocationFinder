from rest_framework import serializers

from Zoopla.models import Property, PropertyImage, RentalPrice


class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ('num_bathrooms', 'num_bedrooms', 'num_recepts')


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('url',)


class RentalPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalPrice
        fields = ('per_month', 'per_week', 'shared_occupancy')


class PropertySerializer(serializers.ModelSerializer):
    propertyimage_set = PropertyImageSerializer(many=True)
    rentalprice_set = RentalPriceSerializer(many=True)

    class Meta:
        model = Property
        fields = ('listing_id', 'longitude', 'latitude', 'street_name', 'post_town',
                  'outcode', 'price', 'listing_status', 'details_url', 'thumbnail_url', 'propertyimage_set',
                  'rentalprice_set')
