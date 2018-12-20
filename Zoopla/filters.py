import django_filters, json
from django.db.models import Q

from Zoopla.models import Property


class PropertyBasicFilter(django_filters.FilterSet):
    area = django_filters.CharFilter(method="filter_area")
    price = django_filters.RangeFilter(field_name="rentalprice__per_month") # price_min and price_max
    num_bathrooms = django_filters.RangeFilter()
    num_bedrooms = django_filters.RangeFilter()
    num_floors = django_filters.RangeFilter()
    num_recepts	= django_filters.RangeFilter()
    # by_distance = django_filters.CharFilter(method='filter_by_distance')

    #
    # def filter_price(self, qs, field, value):
    #     return qs.filter()

    # def filter_by_distance(self, qs, field, value):
    #     print(self.request.data)
    #
    #     for a in self.request.data['by_distance']:
    #         print(a['lat'])
    #
    #     return qs

    def filter_area(self, qs, field, value):
        return qs.filter(Q(outcode__istartswith=value) | Q(post_town__iexact=value))

    class Meta:
        model = Property
        fields = ('area', 'price', 'listing_status', 'property_type',
                  'num_bathrooms', 'num_bedrooms', 'num_floors',
                  'num_recepts')