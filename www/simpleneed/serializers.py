"""serializers module."""

from rest_framework.serializers import HyperlinkedModelSerializer

from .models import (
    NeedLocation, Contact, Mood, Need, Gender, Roam, Stats, Message,
    LocatedElement, SupplyLocation
)


class MoodSerializer(HyperlinkedModelSerializer):
    """Mood serializer."""

    class Meta:
        """Meta mood serializer."""

        model = Mood
        fields = ['name']


class NeedSerializer(HyperlinkedModelSerializer):
    """Need serializer."""

    class Meta:
        """Meta need serializer."""

        model = Need
        fields = ['name']


class GenderSerializer(HyperlinkedModelSerializer):
    """Gender serializer."""

    class Meta:
        """Meta gender serializer."""

        model = Gender
        fields = ['name']


class LocatedElementSerializer(HyperlinkedModelSerializer):
    """Located element serializer."""

    class Meta:
        """Located element serializer."""

        model = LocatedElement
        _fields = [
            'id', 'description', 'longitude', 'latitude', 'messages',
            'people', 'haspwd', 'startts', 'endts',
            'utcstartdatetime', 'utcenddatetime', 'needs'
        ]
        fields = _fields + [
            'rroam', 'rneedlocation', 'rsupplylocation'
        ]


class MessageSerializer(HyperlinkedModelSerializer):
    """Message serializer."""

    class Meta:
        """Message serializer."""

        model = Message
        fields = ['id', 'element', 'content', 'ts', 'utcdatetime']


class NeedLocationSerializer(LocatedElementSerializer):
    """Need location serializer."""

    class Meta:
        """Need location serializer."""

        model = NeedLocation
        fields = [
            'roam', 'emergency'
            # 'handicapped', 'sick', 'gender', 'mood'
        ] + LocatedElementSerializer.Meta._fields


class SupplyLocationSerializer(LocatedElementSerializer):
    """Supply location serializer."""

    class Meta:
        """Supply location serializer."""

        model = SupplyLocation
        fields = list(LocatedElementSerializer.Meta._fields)


class ContactSerializer(HyperlinkedModelSerializer):
    """Contact serializer."""

    class Meta:
        """Contact serializer."""

        model = Contact
        fields = ['name', 'description', 'phone', 'website']


class RoamSerializer(LocatedElementSerializer):
    """Roam serializer."""

    class Meta:
        """Roam serializer."""

        model = Roam
        fields = [
            'name', 'needlocations'
        ] + LocatedElementSerializer.Meta._fields


class StatsSerializer(HyperlinkedModelSerializer):
    """Stats serializer."""

    class Meta:
        """Stats serializer."""

        model = Stats
        fields = [
            'ts', 'utcdate', 'needs', 'answeredneeds', 'roams', 'supplies'
        ]
