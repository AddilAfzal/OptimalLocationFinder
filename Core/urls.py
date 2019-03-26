from django.conf.urls import url
from django.urls import path


from Core import views, api

app_name = 'core'

urlpatterns = [
    path('', views.index, name='index'),
    path('results/', views.results, name='results'),
    path('explore/', views.index, name='explore'),
    # path('explore/', views.explore_area, name='explore'),
    path('api/get_demographics/<str:lat>/<str:lon>/', api.get_demographics),
]
