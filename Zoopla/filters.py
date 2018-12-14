import django_filters

from Zoopla.models import Property


class PropertyFilter(django_filters.FilterSet):
    price = django_filters.RangeFilter() # price_min and price_max

    class Meta:
        model = Property
        fields = ('price', 'listing_status', 'property_type')

