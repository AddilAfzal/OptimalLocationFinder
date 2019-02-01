from django.conf.urls import url, include
from rest_framework import routers

from Zoopla.views.api import property_api

router = routers.DefaultRouter()

app_name = 'zoopla'

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    # url(r'^api/properties/', PropertiesList.as_view(), name="api_propertiesa"),
    url(r'^api/properties/', property_api, name="api_properties")
]