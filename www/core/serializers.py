"""serializers module."""

from rest_framework import serializers

from .models import NeedLocation, Contact, Mood, Need, Gender, Roam


class MoodSerializer(serializers.HyperlinkedModelSerializer):
    """Mood serializer."""

    class Meta:
        """Meta mood serializer."""

        model = Mood
        fields = ('name', )


class NeedSerializer(serializers.HyperlinkedModelSerializer):
    """Need serializer."""

    class Meta:
        """Need serializer."""

        model = Need
        fields = ('name', )


class GenderSerializer(serializers.HyperlinkedModelSerializer):
    """Gender serializer."""

    class Meta:
        """Gender serializer."""

        model = Gender
        fields = ('name', )


class NeedLocationSerializer(serializers.HyperlinkedModelSerializer):
    """Need location serializer."""

    class Meta:
        """Need location serializer."""

        model = NeedLocation
        fields = (
            'longitude', 'latitude', 'mood', 'comment', 'needs',
            'handicapped', 'sick', 'gender', 'enddatetime'
        )


class ContactSerializer(serializers.HyperlinkedModelSerializer):
    """Contact serializer."""

    class Meta:
        """Contact serializer."""

        model = Contact
        fields = ('name', 'description', 'phone', 'website')


class RoamSerializer(serializers.HyperlinkedModelSerializer):
    """Roam serializer."""

    class Meta:
        """Roam serializer."""

        model = Roam
        fields = ('name', 'description', 'needlocations', 'enddatetime')
