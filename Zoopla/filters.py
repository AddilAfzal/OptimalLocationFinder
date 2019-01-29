import django_filters, json
from django.db.models import Q
from pandas.compat import reduce

from Zoopla.models import Property


class BasicPropertyFilter(django_filters.FilterSet):
    latitude = django_filters.NumberFilter()
    longitude = django_filters.NumberFilter()
    radius = django_filters.NumberFilter(method='filter_area')
    price = django_filters.RangeFilter(field_name="rentalprice__per_month") # price_min and price_max
    num_floors = django_filters.RangeFilter()
    listing_status = django_filters.CharFilter()
    property_type = django_filters.CharFilter(method='filter_property_type')

    def filter_property_type(self, queryset, field, value):
        data = dict(self.data)

        if data['property_type']:
            q_list = map(lambda n: Q(property_type__icontains=n), data['property_type'])
            q_list = reduce(lambda a, b: a | b, q_list)
            return queryset.filter(q_list)
        else:
            return queryset

    def filter_area(self, queryset, a, b):
        print(a, self.data['latitude'])
        return queryset

        pass

    # def filter_area(self, qs, field, value):
    #     return qs.filter(Q(outcode__istartswith=value) | Q(post_town__iexact=value))

    class Meta:
        model = Property
        fields = ('price', 'listing_status', 'property_type', 'num_floors')


class RoomFilter(django_filters.FilterSet):
    num_bathrooms = django_filters.RangeFilter()
    num_bedrooms = django_filters.RangeFilter()
    num_floors = django_filters.RangeFilter()
    num_recepts	= django_filters.RangeFilter()

    class Meta:
        model = Property
        fields = ('num_bathrooms', 'num_bedrooms', 'num_floors', 'num_recepts')

