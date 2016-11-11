from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from .models import NeedLocation, Contact, Mood, Need, Gender, Roam
from .serializers import (
    NeedLocationSerializer, ContactSerializer, RoamSerializer,
    MoodSerializer, NeedSerializer, GenderSerializer
)

from rest_framework import viewsets

from django_filters import rest_framework as filters


class MoodViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows moods to be viewed or edited.
    """
    queryset = Mood.objects.all()
    serializer_class = MoodSerializer


class NeedViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows needs to be viewed or edited.
    """
    queryset = Need.objects.all()
    serializer_class = NeedSerializer


class GenderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows genders to be viewed or edited.
    """
    queryset = Gender.objects.all()
    serializer_class = GenderSerializer


class NeedLocationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows need locations to be viewed or edited.
    """
    queryset = NeedLocation.objects.all()
    serializer_class = NeedLocationSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('mood', 'needs', 'answeredneeds', 'handicapped', 'gender')


class RoamViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows roams to be viewed or edited.
    """
    queryset = Roam.objects.all()
    serializer_class = RoamSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('name', 'needlocations', 'description')


class ContactViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows contacts to be viewed or edited.
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('name',)


# Create your views here.
class NeedLocationView(DetailView):
    model = NeedLocation


class NeedLocationViews(ListView):
    model = NeedLocation


class ContactView(DetailView):
    model = Contact


class ContactViews(ListView):
    model = Contact


class RoamViews(ListView):
    model = Roam
