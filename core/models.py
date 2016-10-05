#from django.contrib.gis.db import models
from django.db import models

from .utils import obj2str


# define your models here.
class Mood(models.Model):

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):

        return obj2str(self, 'name')


class Need(models.Model):

    name = models.CharField(max_length=32, primary_key=True)
    #img = models.ImageField()

    def __str__(self):

        return obj2str(self, 'name')


class Gender(models.Model):

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):

        return obj2str(self, 'name')


class Homeless(models.Model):

    #location = models.PointField()
    mood = models.ForeignKey(Mood)
    comment = models.CharField(max_length=256, default=None)
    needs = models.ManyToManyField(Need)
    handicapped = models.BooleanField(default=False)
    gender = models.ForeignKey(Gender)

    def __str__(self):

        return obj2str(
            self,
            'mood', 'comment', 'needs', 'handicapped', 'gender'
        )


class Contact(models.Model):

    name = models.CharField(max_length=64, primary_key=True)
    description = models.CharField(max_length=256, null=True)
    phone = models.CharField(max_length=15, default=None)
    website = models.CharField(max_length=256, null=True)
    #area = models.MultiPolygonField()

    def __str__(self):

        return obj2str(self, 'name', 'description', 'phone', 'website')
