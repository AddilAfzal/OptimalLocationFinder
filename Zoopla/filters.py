import django_filters

from Zoopla.models import Property


class PropertyFilter(django_filters.FilterSet):
    price = django_filters.RangeFilter() # price_min and price_max
    num_bathrooms = django_filters.RangeFilter()
    num_bedrooms = django_filters.RangeFilter()
    num_floors = django_filters.RangeFilter()
    num_recepts	= django_filters.RangeFilter()

    class Meta:
        model = Property
        fields = ('price', 'listing_status', 'property_type',
                  'num_bathrooms', 'num_bedrooms', 'num_floors', 'num_recepts')

