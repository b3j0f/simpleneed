"""view module."""

from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from rest_framework.viewsets import ModelViewSet

from .models import (
    NeedLocation, Contact, Mood, Need, Gender, Roam, Stats, Message,
    LocatedElement
)
from .serializers import (
    NeedLocationSerializer, ContactSerializer, RoamSerializer,
    MoodSerializer, NeedSerializer, GenderSerializer, StatsSerializer,
    MessageSerializer, LocatedElementSerializer
)


class MoodViewSet(ModelViewSet):
    """API endpoint that allows moods to be viewed or edited."""

    queryset = Mood.objects.all()
    serializer_class = MoodSerializer
    filter_fields = {'name': ['iregex']}


class NeedViewSet(ModelViewSet):
    """API endpoint that allows needs to be viewed or edited."""

    queryset = Need.objects.all()
    serializer_class = NeedSerializer
    filter_fields = {'name': ['iregex']}


class GenderViewSet(ModelViewSet):
    """API endpoint that allows genders to be viewed or edited."""

    queryset = Gender.objects.all()
    serializer_class = GenderSerializer
    filter_fields = {'name': ['iregex']}


class LocatedElementViewSet(ModelViewSet):
    """API endpoint that allows located elements to be viewed or edited."""

    queryset = LocatedElement.objects.all()
    serializer_class = LocatedElementSerializer
    filter_fields = {
        'description': ['iregex'],
        'longitude': ['exact', 'gte', 'lte'],
        'latitude': ['exact', 'gte', 'lte'],
        'enddatetime': ['exact', 'gte', 'lte'],
        'roam': ['exact'],
        'messages': ['exact'],
        'people': ['exact', 'gte', 'lte']
    }
    ordering_fields = ['enddatetime']
    ordering = ['enddatetime']


class MessageViewSet(ModelViewSet):
    """API endpoint that allows messages to be viewed or edited."""

    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    filter_fields = {
        'content': ['iregex'],
        'element': ['exact'],
        'datetime': ['exact', 'gte', 'lte']
    }


class NeedLocationViewSet(LocatedElementViewSet):
    """API endpoint that allows need locations to be viewed or edited."""

    queryset = NeedLocation.objects.all()
    serializer_class = NeedLocationSerializer
    filter_fields = {
        'mood': ['exact'],
        'needs': ['exact'],
        'handicapped': ['exact'],
        'gender': ['exact'],
        'roam': ['exact']
    }
    filter_fields.update(LocatedElementViewSet.filter_fields)


class RoamViewSet(LocatedElementViewSet):
    """API endpoint that allows roams to be viewed or edited."""

    queryset = Roam.objects.all()
    serializer_class = RoamSerializer
    filter_fields = {
        'name': ['iregex'],
        'needlocations': ['exact']
    }
    filter_fields.update(LocatedElementViewSet.filter_fields)
    ordering_fields = ['name', 'enddatetime']


def _relatedfilter(source, target, name):
    """Add source filters to target filters."""
    for filter_field in source.filter_fields:
        key = '{0}__{1}'.format(filter_field, name)
        target.filter_fields[key] = source.filter_fields[filter_field]

_relatedfilter(NeedLocationViewSet, RoamViewSet, 'needlocations')
_relatedfilter(RoamViewSet, NeedLocationViewSet, 'roam')
_relatedfilter(LocatedElementViewSet, Message, 'element')
_relatedfilter(Message, LocatedElementViewSet, 'messages')
_relatedfilter(Message, NeedLocationViewSet, 'messages')
_relatedfilter(Message, RoamViewSet, 'messages')


class ContactViewSet(ModelViewSet):
    """API endpoint that allows contacts to be viewed or edited."""

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    filter_fields = {'name': ['iregex']}


class StatsViewSet(ModelViewSet):
    """API endpoint that allows stats to be viewed or edited."""

    queryset = Stats.objects.all()
    serializer_class = StatsSerializer
    filter_fields = {
        'year': ['exact', 'gte', 'lte'],
        'month': ['exact', 'gte', 'lte'],
        'day': ['exact', 'gte', 'lte'],
        'needs': ['exact', 'gte', 'lte'],
        'answeredneeds': ['exact', 'gte', 'lte'],
        'roams': ['exact', 'gte', 'lte']
    }


class NeedLocationView(DetailView):
    """API endpoint that allowd need location to be viewed."""

    model = NeedLocation


class NeedLocationViews(ListView):
    """API endpoint that allowd need locations to be viewed."""

    model = NeedLocation


class ContactView(DetailView):
    """API endpoint that allowd contact to be viewed."""

    model = Contact


class ContactViews(ListView):
    """API endpoint that allowd contacts to be viewed."""

    model = Contact


class RoamView(DetailView):
    """API endpoint that allowd roam to be viewed."""

    model = Roam


class RoamViews(ListView):
    """API endpoint that allowd roam to be viewed."""

    model = Roam


class StatsViews(ListView):
    """API endpoint that allowd stats to be viewed."""

    model = Stats
