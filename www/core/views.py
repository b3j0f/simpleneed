"""view module."""

from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.db.models import Q, Count
from rest_framework_filters import (
    RelatedFilter, FilterSet, DateTimeFilter, AllValuesFilter, CharFilter
)

from rest_framework import viewsets

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


class NeedLocationFilterSet(FilterSet):
    """Need location filter set."""

    area = AllValuesFilter()
    datetime = DateTimeFilter(name='enddatetime', lookup_expr='lte')
    mood__name = CharFilter(name='mood__name')
    needs__name = CharFilter(name='needs__name')
    gender__name = CharFilter(name='gender__name')

    class Meta:
        """Meta need location filter set."""

        model = NeedLocation
        fields = {
            'mood': '__all__',
            'needs': '__all__',
            'handicapped': '__all__',
            'gender': '__all__',
            'datetime': '__all__',
            'area': '__all__',
            'mood__name': '__all__',
            'needs__name': '__all__',
            'gender__name': '__all__'
        }


class NeedLocationViewSet(viewsets.ModelViewSet):
    """API endpoint that allows need locations to be viewed or edited."""

    queryset = NeedLocation.objects.all()
    serializer_class = NeedLocationSerializer
    filter_class = NeedLocationFilterSet

    def get_queryset(self):
        """Get need location related to attributes or area or datetime.

        self.kwargs might contain:
        - dict area: circle properties with latitude, longitude and radius.
        - str datetime: date time <= need location enddatetime with format
            Y-m-d H:M.
        """
        result = super(NeedLocationViewSet, self).get_queryset()

        area = self.kwargs.get('area')

        if area is not None:
            latitude, longitude = area['longitude'], area['latitude']
            radius = area['radius']

            qlatitude = abs(Q('latitude') - latitude) <= radius
            qlongitude = abs(Q('longitude') - longitude) <= radius

            result = result.filter(qlatitude & qlongitude)

        return result


class RoamFilterSet(FilterSet):
    """Roam filter set."""

    datetime = DateTimeFilter(name='enddatetime', lookup_expr='lte')
    needlocations = RelatedFilter(NeedLocationFilterSet, name='needlocations')

    class Meta:
        """Roam filter set meta."""

        model = Roam
        fields = {
            'name': '__all__',
            'description': '__all__',
            'needlocations': '__all__',
            'datetime': '__all__',
        }


class RoamViewSet(viewsets.ModelViewSet):
    """API endpoint that allows roams to be viewed or edited."""

    queryset = Roam.objects.all()
    serializer_class = RoamSerializer
    filter_class = RoamFilterSet


class ContactViewSet(viewsets.ModelViewSet):
    """API endpoint that allows contacts to be viewed or edited."""

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
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
