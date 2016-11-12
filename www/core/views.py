"""view module."""

from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.db.models import Q
from django.http import HttpResponse

from rest_framework.viewsets import ModelViewSet

from datetime import datetime as dt

from .models import NeedLocation, Contact, Mood, Need, Gender, Roam
from .serializers import (
    NeedLocationSerializer, ContactSerializer, RoamSerializer,
    MoodSerializer, NeedSerializer, GenderSerializer
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


def getareaneedlocations(area=None, datetime=None, objects=None):
    """Get need location related to attributes or area or datetime.

    :param dict area: circle properties with latitude, longitude and radius.
    :param str datetime: date time <= need location enddatetime with format
        Y-m-d H:M.
    """
    result = objects or NeedLocation.objects.all()

    if area is not None:
        latitude, longitude = area['longitude'], area['latitude']
        radius = area['radius']

        qlatitude = abs(Q('latitude') - latitude) <= radius
        qlongitude = abs(Q('longitude') - longitude) <= radius

        result = result.filter(qlatitude & qlongitude)

    if datetime is not None:

        datetime = dt.strptime('%Y-%m-%d %H:%M')

        result = result.filter(Q('enddatetime') >= datetime)

    return result


class NeedLocationViewSet(ModelViewSet):
    """API endpoint that allows need locations to be viewed or edited."""

    queryset = NeedLocation.objects.all()
    serializer_class = NeedLocationSerializer
    filter_fields = ('mood', 'needs', 'handicapped', 'gender')
    ordering_fields = ('enddatetime',)
    ordering = ('enddatetime',)

    def get_queryset(self):
        """Get need location related to attributes or area or datetime.

        self.kwargs might contain:
        - dict area: circle properties with latitude, longitude and radius.
        - str datetime: date time <= need location enddatetime with format
            Y-m-d H:M.
        """
        result = super(NeedLocationViewSet, self).get_queryset()

        area = self.kwargs.get('area')
        datetime = self.kwargs.get('datetime')

        return getareaneedlocations(
            area=area, datetime=datetime, objects=result
        )


def getarearoams(area=None, datetime=None, objects=None):
    """Get roam related to attributes or area or datetime.

    :param dict area: circle properties with latitude, longitude and radius.
    :param str datetime: date time <= need location enddatetime with format
        Y-m-d H:M.
    """
    result = objects or Roam.objects.all()

    if area is not None:
        latitude, longitude = area['longitude'], area['latitude']
        radius = area['radius']

        qlatitude = abs(Q('needlocations__latitude') - latitude) <= radius
        qlongitude = abs(Q('needlocations__longitude') - longitude) <= radius

        result = result.filter(qlatitude & qlongitude)

    if datetime is not None:

        datetime = dt.strptime('%Y-%m-%d %H:%M')

        result = result.filter(Q('enddatetime') >= datetime)

    return result


class RoamViewSet(ModelViewSet):
    """API endpoint that allows roams to be viewed or edited."""

    queryset = Roam.objects.all()
    serializer_class = RoamSerializer
    filter_fields = {'name': ['iregex'], 'description': ['iregex']}
    ordering_fields = ['name', 'enddatetime']
    ordering = ('enddatetime', )

    def get_queryset(self):
        """Get need location related to attributes or area or datetime.

        self.kwargs might contain:
        - dict area: circle properties with latitude, longitude and radius.
        - str datetime: date time <= need location enddatetime with format
            Y-m-d H:M.
        """
        result = super(RoamViewSet, self).get_queryset()

        area = self.kwargs.get('area')
        datetime = self.kwargs.get('datetime')

        return getarearoams(area=area, datetime=datetime, objects=result)


class ContactViewSet(ModelViewSet):
    """API endpoint that allows contacts to be viewed or edited."""

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    filter_fields = {'name': ['iregex']}


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


def areaneedlocations(request):
    """Get need locations."""
    area = request.GET.get('area')
    datetime = request.GET.get('datetime')

    return getareaneedlocations(area=area, datetime=datetime)


def arearoams(request):
    """Get area roams."""
    area = request.GET.get('area')
    datetime = request.GET.get('datetime')

    return getarearoams(area=area, datetime=datetime)


def needlocationcount(request):
    """Get count of need locations per area or datetime.

    :param dict area: location area with longitude, latitude and radius.
    :param str datetime: datetime before need location enddatetimes. Y-m-d H:M.
    :rtype: int
    """
    result = NeedLocation.objects.all()

    area = request.GET.get('area')

    if area is not None:
        latitude, longitude = area['longitude'], area['latitude']
        radius = area['radius']

        qlatitude = abs(Q('latitude') - latitude) <= radius
        qlongitude = abs(Q('longitude') - longitude) <= radius

        result = result.filter(qlatitude & qlongitude)

    datetime = request.GET.get('datetime')

    if datetime is not None:
        datetime = datetime.strptime(datetime, "%Y-%m-%d %H:%M")
        qdatetime = Q('enddatetime') <= datetime

        result = result.filter(qdatetime)

    result = result.count()

    result = HttpResponse(repr(result))


def roamcount(request):
    """Get count of roams per area or datetime.

    :param dict area: location area with longitude, latitude and radius.
    :param str datetime: datetime before roam enddatetimes. Y-m-d H:M.
    :rtype: int
    """
    result = Roam.objects.all()

    area = request.GET.get('area')

    if area is not None:
        latitude, longitude = area['longitude'], area['latitude']
        radius = area['radius']

        qlatitude = abs(Q('needlocations__latitude') - latitude) <= radius
        qlongitude = abs(Q('needlocations__longitude') - longitude) <= radius

        result = result.filter(qlatitude & qlongitude)

    datetime = request.GET.get('datetime')

    if datetime is not None:
        datetime = datetime.strptime(datetime, "%Y-%m-%d %H:%M")
        qdatetime = Q('enddatetime') <= datetime

        result = result.filter(qdatetime)

    result = result.count()

    result = HttpResponse(repr(result))
