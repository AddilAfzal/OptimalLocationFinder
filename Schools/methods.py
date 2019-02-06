from django.db.models import Q

from Schools.filters import SchoolFilter
from Schools.models import School


def filter_properties_for_schools(data, qs):
    where_list = []

    if 'aschool' in data:
        school_radius = 1

        # Schools that match our conditions
        schools_location = SchoolFilter(data['school'], School.objects.all()).qs.values_list('lat', 'lng')

        for sl in schools_location:
            where_list.append("((6367*acos(cos(radians(%s))*"
            "cos(radians(latitude))*"
            "cos(radians(longitude)-radians(%s))+"
            "sin(radians(%s))*sin(radians(latitude)))) < %s)" % (sl[0], sl[1], sl[0], school_radius))

    return qs.extra(where=" OR ".join(where_list))
