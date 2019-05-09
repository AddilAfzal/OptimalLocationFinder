from django.conf.urls import url, include
from django.urls import path
from rest_framework import routers

from ActivePlaces.api import *

router = routers.DefaultRouter()

app_name = 'heremaps'

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('api/get_closest_active_places/<str:latitude>/<str:longitude>/', get_active_places),
]