"""LocationFinder URL ConfigurationCQC

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include

import Core
# from LocationFinder import views
from LocationFinder import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Core.urls', namespace="Core")),
    path('', include('Schools.urls', namespace="Schools")),
    path('', include('Zoopla.urls', namespace="Zoopla")),
    path('', include('HereMaps.urls', namespace="HereMaps")),
    path('', include('CQC.urls', namespace="CQC")),
    path('', include('ActivePlaces.urls', namespace="ActivePlaces")),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),

        # For django versions before 2.0:
        # url(r'^__debug__/', include(debug_toolbar.urls)),

    ] + urlpatterns