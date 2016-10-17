from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from .models import Homeless, Contact, Mood, Need, Gender
from .serializers import (
    HomelessSerializer, ContactSerializer,
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


class HomelessViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows simpleneedes to be viewed or edited.
    """
    queryset = Homeless.objects.all()
    serializer_class = HomelessSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('mood', 'needs', 'answeredneeds', 'handicapped', 'gender')


class ContactViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows contacts to be viewed or edited.
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('name',)


# Create your views here.
class HomelessView(DetailView):
    model = Homeless


class HomelessViews(ListView):
    model = Homeless


class ContactView(DetailView):
    model = Contact


class ContactViews(ListView):
    model = Contact
