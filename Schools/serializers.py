from django.conf.urls import url, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets

# Serializers define the API representation.
from Schools.models import School


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('name', 'lng', 'lat')

