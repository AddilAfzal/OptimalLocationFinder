from django.conf.urls import url, include
from Schools.viewsets import SchoolViewSet

app_name = "schools"

urlpatterns = [
    url(r'^api/schools/', SchoolViewSet.as_view({'get':'list'}), name="api_properties")
]
