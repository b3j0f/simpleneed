"""homeless URL Configuration

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
from django.conf.urls import url
from django.contrib import admin

from .views import HomelessView, HomelessViews, ContactView, ContactViews


urlpatterns = [
    url(r'^homeless/{id}', HomelessView.get_view(), name='homeless'),
    url(r'^homelesses/{query}', HomelessViews.get_view(), name='homelesses'),
    url(r'^contact/{id}', ContactView.get_view(), name='contact'),
    url(r'^contacts/{query}', ContactViews.get_view(), name='contacts'),
]
