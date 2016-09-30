from django.contrib.gis.db import models

from .utils import obj2str


# define your models here.
class Mood(models.Model):

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):

        return obj2str(self, 'name')


class Need(models.Model):

    name = models.CharField(max_length=32, primary_key=True)
    img = models.ImageField()

    def __str__(self):

        return obj2str(self, 'name', 'img')


class Gender(models.Model):

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):

        return obj2str(self, 'name')


class Homeless(models.Model):

    location = models.PointField()
    mood = models.EnumField(Mood)
    comment = models.CharField(max_length=256)
    needs = models.ManyToMany(Need)
    handicapped = models.BooleanField()
    gender = models.EnumField(Gender)

    def __str__(self):

        return obj2str(
            self,
            'location', 'feeling', 'comment', 'needs', 'handicapped', 'gender'
        )


class Contact(models.Model):

    name = models.CharField(max_length=64, primary_key=True)
    description = models.CharField(max_length=256)
    phone = models.CharField(max_length=15)
    area = models.MultiPolygonField()

    def __str__(self):

        return obj2str(self, 'country', 'phoneinformations')
