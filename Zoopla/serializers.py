from rest_framework import serializers

from Zoopla.models import Property, PropertyImage, RentalPrice


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('url',)


class RentalPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalPrice
        fields = ('per_month', 'per_week', 'shared_occupancy')


class BasicPropertySerializer(serializers.ModelSerializer):
    route_data = serializers.JSONField(allow_null=True)

    class Meta:
        model = Property
        fields = ('listing_id', 'longitude', 'latitude', 'route_data')


class PropertyInformationSerializer(serializers.ModelSerializer):
    propertyimage_set = PropertyImageSerializer(many=True)
    rentalprice_set = RentalPriceSerializer(many=True)

    class Meta:
        model = Property
        fields = ('short_description', 'num_bathrooms', 'num_bedrooms', 'num_recepts', 'first_published',
                  'last_published', 'street_name', 'post_town',
                  'outcode', 'price', 'listing_status', 'details_url', 'thumbnail_url', 'propertyimage_set',
                  'rentalprice_set', )
