"""simpleneed URL Configuration.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.conf import settings
from django.contrib import admin

from .views import (
    homeview, mapview, statsview, roamsview, needlocationsview, aboutview,
    faqview, supplylocationsview
)
print(settings.API)
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(
        r'^api-auth/',
        include('rest_framework.urls', namespace='rest_framework')
    ),
    url(r'^{0}/'.format(settings.API), include('simpleneed.urls')),
    url(r'^home', homeview),
    url(r'^map', mapview),
    url(r'^needlocations', needlocationsview),
    url(r'^supplylocations', supplylocationsview),
    url(r'^roams', roamsview),
    url(r'^stats', statsview),
    url(r'^faq', faqview),
    url(r'^about', aboutview),
    url(r'^', homeview),
]
