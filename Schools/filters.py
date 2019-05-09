import django_filters

from Schools.models import School


class SchoolFilter(django_filters.FilterSet):
    religion = django_filters.CharFilter(lookup_expr='iexact')
    is_primary = django_filters.BooleanFilter(method="filter_true")
    is_secondary = django_filters.BooleanFilter(method="filter_true")
    is_post16 = django_filters.BooleanFilter(method="filter_true")

    def filter_true(self, queryset, field, value):
        print(field, value)
        return queryset.filter(**{field: True}) if value else queryset

    class Meta:
        model = School
        fields = ['religion', 'selective', 'is_post16', 'is_primary', 'is_secondary', 'gender']
