from rest_framework import serializers

from .models import Homeless, Contact, Mood, Need, Gender


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


class HomelessSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Homeless
        fields = (
        	'mood', 'comment', 'needs', 'handicapped', 'gender'
        )


class ContactSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Contact
        fields = ('name', 'description', 'phone', 'website')
