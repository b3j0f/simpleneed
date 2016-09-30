from django.db import models

from enum import IntEnum, unique

from .utils import obj2str


@unique
class Mood(IntEnum):
    happy = 1
    neutral = 2
    sad = 3
    bad = 4
    angry = 5

    def __str__(self):

        return self.name


class HomelessNeed(models.Model):

    name = models.CharField(max_length=32, primary_key=True)
    img = models.ImageField()

    def __str__(self):

        return obj2str(self, 'name', 'img')


@unique
class Kind(IntEnum):

    male = 1
    female = 2

    def __str__(self):

        return self.name


class HomelessSituation(models.Model):

    location = models.CharField(max_length=32)
    mood = models.EnumField(Mood)
    comment = models.CharField(max_length=256)
    needs = models.ManyToMany(HomelessNeed)
    handicapped = models.BooleanField()
    kind = models.EnumField(Kind)

    def __str__(self):

        return obj2str(
            self,
            'location', 'feeling', 'comment', 'needs', 'handicapped', 'kind'
        )


class HelpContact(models.Model):

    country = models.CharField(max_length=60)
    number = models.CharField(max_length=15)

    def __str__(self):

        return obj2str(self, 'country', 'number')
