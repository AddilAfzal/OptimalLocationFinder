import django_filters

from Schools.models import School


class ProductFilter(django_filters.FilterSet):
    class Meta:
        model = School
        fields = ['name']