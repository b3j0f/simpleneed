#from django.db import models
from django.contrib.gis.db import models

from .utils import obj2str


# define your models here.
class Mood(models.Model):
    """Mood object"""

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):

        return obj2str(self, 'name')


class Need(models.Model):
    """Need object."""

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):

        return obj2str(self, 'name')


class Gender(models.Model):

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):

        return obj2str(self, 'name')


class NeedLocation(models.Model):

    location = models.PointField()

    longitude = models.FloatField()
    latitude = models.FloatField()
    mood = models.ForeignKey(Mood, default='neutral')
    comment = models.CharField(max_length=256, default=None, null=True)
    needs = models.ManyToManyField(Need)
    answeredneeds = models.ManyToManyField(
        Need, related_name='answered', default=[]
    )
    handicapped = models.BooleanField(default=False)
    sick = models.BooleanField(default=False)
    gender = models.ForeignKey(Gender, default='other')

    def __str__(self):

        return obj2str(
            self,
            'mood', 'answeredneeds', 'comment', 'needs', 'handicapped',
            'gender'
        )


class Contact(models.Model):

    name = models.CharField(max_length=64, primary_key=True)
    description = models.CharField(max_length=256, null=True)
    phone = models.CharField(max_length=15, default=None)
    website = models.CharField(max_length=256, null=True)

    def __str__(self):

        return obj2str(self, 'name', 'description', 'phone', 'website')


class Roam(models.Model):

    name = models.CharField(max_length=256)
    description = models.CharField(max_length=256, default=None, null=True)
    needlocations = models.ManyToManyField(NeedLocation)
