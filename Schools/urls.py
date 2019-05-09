from django.conf.urls import url, include
from django.urls import path

from Schools.views.api import get_closest_schools
from Schools.viewsets import SchoolViewSet

app_name = "schools"

urlpatterns = [
    path('api/get_closest_schools/<str:latitude>/<str:longitude>/', get_closest_schools),
]