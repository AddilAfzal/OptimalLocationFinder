import django_filters, json
from django.db.models import Q
from pandas.compat import reduce

from Zoopla.models import Property


class BasicPropertyFilter(django_filters.FilterSet):
    listing_status = django_filters.CharFilter()
    property_type = django_filters.CharFilter(method='filter_property_type')

    area = django_filters.CharFilter(method="filter_area")

    def filter_area(self, queryset, field, value):
        data = dict(self.data)
        if 'radius' in data:
            lat, lng = value.split(",")
            return queryset.extra(where=["(6367*acos(cos(radians(%s))*"
                                         "cos(radians(latitude))*"
                                         "cos(radians(longitude)-radians(%s))+"
                                         "sin(radians(%s))*sin(radians(latitude)))) < %s" % (lat, lng, lat, data['radius'])])
        return queryset

    def filter_property_type(self, queryset, field, value):
        data = dict(self.data)

        if data[field]:
            q_list = map(lambda n: Q(property_type__icontains=n), data[field])
            q_list = reduce(lambda a, b: a | b, q_list)
            return queryset.filter(q_list)
        else:
            return queryset

    class Meta:
        model = Property
        fields = ('listing_status', 'property_type')


class RoomFilter(django_filters.FilterSet):
    num_bathrooms = django_filters.RangeFilter()
    num_bedrooms = django_filters.RangeFilter()
    num_floors = django_filters.RangeFilter()
    num_recepts	= django_filters.RangeFilter()

    class Meta:
        model = Property
        fields = ('num_bathrooms', 'num_bedrooms', 'num_floors', 'num_recepts')


class PriceFilter(django_filters.FilterSet):
    ACCURATE_CHOICES = (
        (0, 'per_month'),
        (1, 'per_week'),
    )

    rentalprice__per_month = django_filters.RangeFilter(method='filter_price') # price_min and price_max
    rentalprice__per_week = django_filters.RangeFilter(method='filter_price') # price_min and price_max
    price = django_filters.RangeFilter(method='filter_price')

    accurate = django_filters.ChoiceFilter(choices=ACCURATE_CHOICES, required=False)

    def filter_price(self, queryset, field, value):
        data = dict(self.data)
        if 'listing_status' in data:
            listing_status = data['listing_status']
            
            filters = {}
            filters['listing_status'] = listing_status

            if value.stop:
                filters[field + '__lte'] = value.stop

            if value.start:
                filters[field + '__gte'] = value.start
            
            return queryset.filter(**filters)
        else:
            return queryset

    class Meta:
        model = Property
        fields = ['price']


class AreaFilter(django_filters.FilterSet):
    area = django_filters.CharFilter(method="filter_area")

    def filter_area(self, queryset, field, value):
        data = dict(self.data)
        if 'radius' in data:
            lat, lng = value.split(",")
            return queryset.extra(where=["(6367*acos(cos(radians(%s))*"
                                         "cos(radians(latitude))*"
                                         "cos(radians(longitude)-radians(%s))+"
                                         "sin(radians(%s))*sin(radians(latitude)))) < %s" % (lat, lng, lat, data['radius'])])
        return queryset

    class Meta:
        model = Property
        fields = ('area',)
