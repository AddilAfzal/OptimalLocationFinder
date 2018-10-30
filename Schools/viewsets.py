# ViewSets define the view behavior.
from rest_framework import viewsets

from Schools.models import School
from Schools.serializers import SchoolSerializer


class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer

