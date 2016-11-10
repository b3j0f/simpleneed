from rest_framework import serializers

from .models import NeedLocation, Contact, Mood, Need, Gender, Roam


class MoodSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Mood
        fields = ('name', )


class NeedSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Need
        fields = ('name', )


class GenderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Gender
        fields = ('name', )


class NeedLocationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = NeedLocation
        fields = (
            'longitude', 'latitude', 'mood', 'comment', 'needs',
            'answeredneeds', 'handicapped', 'sick', 'gender'
        )


class ContactSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Contact
        fields = ('name', 'description', 'phone', 'website')


class RoamSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Roam
        fields = ('name', 'description')
