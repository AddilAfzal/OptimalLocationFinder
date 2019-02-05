from django.conf.urls import url, include
from django.urls import path
from rest_framework import routers

from Zoopla.views.api import property_api, get_property

router = routers.DefaultRouter()

app_name = 'zoopla'

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    # url(r'^api/properties/', PropertiesList.as_view(), name="api_propertiesa"),
    url(r'^api/properties/$', property_api, name="api_properties"),
    path('api/properties/<int:listing_id>/', get_property, name="get_property"),
]