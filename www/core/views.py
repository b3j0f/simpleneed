"""view module."""

from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.db.models import Q, Count
from django_filters import rest_framework as filters
from django_filters.filters import DateTimeFilter, AllValuesFilter

from rest_framework import viewsets

from datetime import datetime as dt

from .models import NeedLocation, Contact, Mood, Need, Gender, Roam
from .serializers import (
    NeedLocationSerializer, ContactSerializer, RoamSerializer,
    MoodSerializer, NeedSerializer, GenderSerializer
)


class MoodViewSet(viewsets.ModelViewSet):
    """API endpoint that allows moods to be viewed or edited."""

    queryset = Mood.objects.all()
    serializer_class = MoodSerializer


class NeedViewSet(viewsets.ModelViewSet):
    """API endpoint that allows needs to be viewed or edited."""

    queryset = Need.objects.all()
    serializer_class = NeedSerializer


class GenderViewSet(viewsets.ModelViewSet):
    """API endpoint that allows genders to be viewed or edited."""

    queryset = Gender.objects.all()
    serializer_class = GenderSerializer


class NeedLocationViewSet(viewsets.ModelViewSet):
    """API endpoint that allows need locations to be viewed or edited."""

    queryset = NeedLocation.objects.all()
    serializer_class = NeedLocationSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = (
        'latitude', 'longitude', 'mood', 'needs',
        'handicapped', 'gender', 'enddatetime'
    )
    area = AllValuesFilter()
    datetime = DateTimeFilter(name='enddatetime')
    ordering = ('enddatetime',)

    def get_queryset(self):
        """Get need location related to attributes or area or datetime.

        self.kwargs might contain:
        - dict area: circle properties with latitude, longitude and radius.
        - str datetime: date time <= need location enddatetime with format
            Y-m-d H:M.
        """
        result = super(NeedLocationViewSet, self).get_queryset(self)

        area = self.kwargs.get('area')

        if area is not None:
            latitude, longitude = area['longitude'], area['latitude']
            radius = area['radius']

            qlatitude = abs(Q('latitude') - latitude) <= radius
            qlongitude = abs(Q('longitude') - longitude) <= radius

            result = result.filter(qlatitude & qlongitude)

        datetime = self.kwargs.get('datetime')

        if datetime is not None:
            datetime = dt.strptime(datetime, "%Y-%m-%d %H:%M")
            qdatetime = Q('enddatetime') <= datetime

            result = result.filter(qdatetime)

        return result


class RoamViewSet(viewsets.ModelViewSet):
    """API endpoint that allows roams to be viewed or edited."""

    queryset = Roam.objects.all()
    serializer_class = RoamSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('name', 'needlocations', 'description')

    area = AllValuesFilter()

    def get_queryset(self):
        """Get roam related to attributes, enddatetime or need location area.

        self.kwargs might contain:
        - dict area: circle properties with latitude, longitude and radius.
        - str datetime: date time <= roam enddatetime with format Y-m-d H:M.
        """
        result = super(RoamViewSet, self).get_queryset(self)

        area = self.kwargs.get('area')

        if area is not None:
            latitude, longitude = area['longitude'], area['latitude']
            radius = area['radius']

            qnllatitude = Q('needlocations__latitude')
            qnllongitude = Q('needlocations__longitude')
            qlatitude = abs(qnllatitude - latitude) <= radius
            qlongitude = abs(qnllongitude - longitude) <= radius

            result = result.filter(qlatitude & qlongitude)

        datetime = self.kwargs.get('datetime')

        if datetime is not None:
            datetime = dt.strptime(datetime, "%Y-%m-%d %H:%M")
            qdatetime = Q('enddatetime') <= datetime

            result = result.filter(qdatetime)

        return result


class ContactViewSet(viewsets.ModelViewSet):
    """API endpoint that allows contacts to be viewed or edited."""

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('name',)


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


def needlocationcount(request):
    """Get count of need locations per area or datetime.

    :param dict area: location area with longitude, latitude and radius.
    :param str datetime: datetime before need location enddatetimes. Y-m-d H:M.
    :rtype: int
    """
    result = NeedLocation.objects.all()

    area = request.params.get('area')

    if area is not None:
        latitude, longitude = area['longitude'], area['latitude']
        radius = area['radius']

        qlatitude = abs(Q('latitude') - latitude) <= radius
        qlongitude = abs(Q('longitude') - longitude) <= radius

        result = result.filter(qlatitude & qlongitude)

    datetime = request.params.get('datetime')

    if datetime is not None:
        datetime = datetime.strptime(datetime, "%Y-%m-%d %H:%M")
        qdatetime = Q('enddatetime') <= datetime

        result = result.filter(qdatetime)

    return Count(result)


def roamcount(request):
    """Get count of roams per area or datetime.

    :param dict area: location area with longitude, latitude and radius.
    :param str datetime: datetime before roam enddatetimes. Y-m-d H:M.
    :rtype: int
    """
    result = Roam.objects.all()

    area = request.params.get('area')

    if area is not None:
        latitude, longitude = area['longitude'], area['latitude']
        radius = area['radius']

        qlatitude = abs(Q('needlocations__latitude') - latitude) <= radius
        qlongitude = abs(Q('needlocations__longitude') - longitude) <= radius

        result = result.filter(qlatitude & qlongitude)

    datetime = request.params.get('datetime')

    if datetime is not None:
        datetime = datetime.strptime(datetime, "%Y-%m-%d %H:%M")
        qdatetime = Q('enddatetime') <= datetime

        result = result.filter(qdatetime)

    return Count(result)
