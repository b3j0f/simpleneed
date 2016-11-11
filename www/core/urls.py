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

from .views import (
    NeedLocationViewSet, ContactViewSet, MoodViewSet, GenderViewSet,
    NeedViewSet, RoamViewSet, needlocationcount
)

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'moods', MoodViewSet)
router.register(r'needs', NeedViewSet)
router.register(r'genders', GenderViewSet)
router.register(r'needlocations', NeedLocationViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'roams', RoamViewSet)
router.register(r'needlocationcount', needlocationcount)

urlpatterns = [
    url(r'^', include(router.urls))
]
