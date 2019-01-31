from django.conf.urls import url, include
from django.urls import path
from rest_framework import routers

from HereMaps.views import api

router = routers.DefaultRouter()

app_name = 'heremaps'

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api/distance/', api.distance_api, name="api_distances"),
    path('api/reverse-geo-code/<str:lat>/<str:lng>/', api.reverse_geo_code),
]