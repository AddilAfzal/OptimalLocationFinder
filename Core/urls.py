from django.conf.urls import url
from django.urls import path


from Core import views

app_name = 'core'

urlpatterns = [
    path('', views.index, name='index'),
    path('map/', views.properties_map, name='map'),
]
