import django_filters

from Schools.models import School


class SchoolFilter(django_filters.FilterSet):

    class Meta:
        model = School
        fields = ['religion', 'selective', 'is_post16', 'is_primary', 'is_secondary']
