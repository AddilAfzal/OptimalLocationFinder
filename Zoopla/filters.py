import django_filters, json
from django.db.models import Q
from pandas.compat import reduce

from Zoopla.models import Property


class BasicPropertyFilter(django_filters.FilterSet):
    latitude = django_filters.NumberFilter()
    longitude = django_filters.NumberFilter()
    radius = django_filters.NumberFilter(method='filter_area')
    num_floors = django_filters.RangeFilter()
    listing_status = django_filters.CharFilter()
    property_type = django_filters.CharFilter(method='filter_property_type')

    def filter_property_type(self, queryset, field, value):
        data = dict(self.data)

        if data[field]:
            q_list = map(lambda n: Q(property_type__icontains=n), data[field])
            q_list = reduce(lambda a, b: a | b, q_list)
            return queryset.filter(q_list)
        else:
            return queryset

    def filter_area(self, queryset, field, value):
        print(a, self.data['latitude'])
        return queryset

    # def filter_area(self, qs, field, value):
    #     return qs.filter(Q(outcode__istartswith=value) | Q(post_town__iexact=value))

    class Meta:
        model = Property
        fields = ('listing_status', 'property_type', 'num_floors')


class RoomFilter(django_filters.FilterSet):
    num_bathrooms = django_filters.RangeFilter()
    num_bedrooms = django_filters.RangeFilter()
    num_floors = django_filters.RangeFilter()
    num_recepts	= django_filters.RangeFilter()

    class Meta:
        model = Property
        fields = ('num_bathrooms', 'num_bedrooms', 'num_floors', 'num_recepts')


class PriceFilter(django_filters.FilterSet):
    price = django_filters.RangeFilter(field_name="rentalprice__per_month", method='filter_price') # price_min and price_max

    def filter_price(self, queryset, field, value):
        data = dict(self.data)
        if 'listing_status' in data:
            listing_status = data['listing_status'][0]
            
            filters = {}
            filters['listing_status'] = listing_status

            if value.stop:
                filters['price__lte'] = value.stop

            if value.start:
                filters['price__gte'] = value.start
            
            return queryset.filter(**filters)
        else:
            return queryset

    class Meta:
        model = Property
        fields = ['price']
