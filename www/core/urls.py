"""simpleneed URL Configuration

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

from .views import (
    HomelessView, HomelessViews, ContactView, ContactViews,
    HomelessViewSet, ContactViewSet, MoodViewSet, GenderViewSet, NeedViewSet
)

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'moods', MoodViewSet)
router.register(r'needs', NeedViewSet)
router.register(r'genders', GenderViewSet)
router.register(r'homelesses', HomelessViewSet)
router.register(r'contacts', ContactViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]