"""serializers module."""

from rest_framework.serializers import HyperlinkedModelSerializer

from .models import NeedLocation, Contact, Mood, Need, Gender, Roam, Stats


class MoodSerializer(HyperlinkedModelSerializer):
    """Mood serializer."""

    class Meta:
        """Meta mood serializer."""

        model = Mood
        fields = ('name', )


class NeedSerializer(HyperlinkedModelSerializer):
    """Need serializer."""

    class Meta:
        """Need serializer."""

        model = Need
        fields = ('name', )


class GenderSerializer(HyperlinkedModelSerializer):
    """Gender serializer."""

    class Meta:
        """Gender serializer."""

        model = Gender
        fields = ('name', )


class NeedLocationSerializer(HyperlinkedModelSerializer):
    """Need location serializer."""

    class Meta:
        """Need location serializer."""

        model = NeedLocation
        fields = (
            'longitude', 'latitude', 'mood', 'comment', 'needs',
            'handicapped', 'sick', 'gender', 'enddatetime'
        )


class ContactSerializer(HyperlinkedModelSerializer):
    """Contact serializer."""

    class Meta:
        """Contact serializer."""

        model = Contact
        fields = ('name', 'description', 'phone', 'website')


class RoamSerializer(HyperlinkedModelSerializer):
    """Roam serializer."""

    class Meta:
        """Roam serializer."""

        model = Roam
        fields = (
            'name', 'description', 'needlocations', 'enddatetime',
            'longitude', 'latitude'
        )


class StatsSerializer(HyperlinkedModelSerializer):
    """Stats serializer."""

    class Meta:
        """Stats serializer."""

        model = Stats
        fields = ('day', 'year', 'month', 'needs', 'answeredneeds', 'roams')
