from django.conf.urls import url, include
from Schools.viewsets import SchoolViewSet

urlpatterns = [
    url(r'^api/schools/', SchoolViewSet.as_view({'get':'list'}), name="api_properties")
]
