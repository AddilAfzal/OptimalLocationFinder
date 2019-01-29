import django_filters, json
from django.db.models import Q

from Zoopla.models import Property


class BasicPropertyFilter(django_filters.FilterSet):
    area = django_filters.CharFilter(method="filter_area")
    price = django_filters.RangeFilter(field_name="rentalprice__per_month") # price_min and price_max
    num_bathrooms = django_filters.RangeFilter()
    num_bedrooms = django_filters.RangeFilter()
    num_floors = django_filters.RangeFilter()
    num_recepts	= django_filters.RangeFilter()
    listing_status = django_filters.CharFilter()

    def filter_area(self, qs, field, value):
        return qs.filter(Q(outcode__istartswith=value) | Q(post_town__iexact=value))

    class Meta:
        model = Property
        fields = ('area', 'price', 'listing_status', 'property_type',
                  'num_bathrooms', 'num_bedrooms', 'num_floors',
                  'num_recepts')
