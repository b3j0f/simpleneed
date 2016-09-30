from django.shortcuts import render

from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from .models import Homeless


# Create your views here.
class HomelessView(DetailView):
    model = Homeless


class HomelessViews(ListView):
    model = Homeless


class ContactView(DetailView):
    model = Contact


class ContactViews(ListView):
    model = Contact
