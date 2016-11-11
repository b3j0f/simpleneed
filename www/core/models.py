"""Model module."""

from django.db import models
# from django.contrib.gis.db import models

from django.db.models.signals import pre_save
from django.dispatch import receiver

from datetime import datetime

from .utils import obj2str


class Mood(models.Model):
    """Mood model."""

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):
        """representation."""
        return obj2str(self, 'name')


class Need(models.Model):
    """Need model."""

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):
        """representation."""
        return obj2str(self, 'name')


class Gender(models.Model):
    """Gender model."""

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):
        """representation."""
        return obj2str(self, 'name')


class NeedLocation(models.Model):
    """need location model."""

    # location = models.PointField()

    longitude = models.FloatField()
    latitude = models.FloatField()
    mood = models.ForeignKey(Mood, default='neutral')
    comment = models.CharField(max_length=256, default=None, null=True)
    needs = models.ManyToManyField(Need)
    handicapped = models.BooleanField(default=False)
    sick = models.BooleanField(default=False)
    gender = models.ForeignKey(Gender, default='other')
    enddatetime = models.DateTimeField(null=False)

    def __str__(self):
        """representation."""
        return obj2str(
            self,
            'latitude', 'longitude', 'mood', 'comment',
            'needs', 'handicapped', 'gender', 'enddatetime'
        )


class Contact(models.Model):
    """Contact model."""

    name = models.CharField(max_length=64, primary_key=True)
    description = models.CharField(max_length=256, null=True)
    phone = models.CharField(max_length=15, default=None)
    website = models.CharField(max_length=256, null=True)

    def __str__(self):
        """representation."""
        return obj2str(self, 'name', 'description', 'phone', 'website')


class Roam(models.Model):
    """Roam model."""

    name = models.CharField(max_length=256)
    description = models.CharField(max_length=256, default=None, null=True)
    needlocations = models.ManyToManyField(NeedLocation)
    enddatetime = models.DateTimeField(null=False)

    def __str__(self):
        """representation."""
        return obj2str(
            self, 'name', 'description', 'needlocations', 'enddatetime'
        )


class Stats(models.Model):
    """Stats model."""

    allneeds = models.IntegerField(default=0)
    allansweredneeds = models.IntegerField(default=0)


class YearStats(Stats):
    """Year stats model."""

    year = models.IntegerField()


class MonthStats(YearStats):
    """Month stats model."""

    month = models.IntegerField()


class DayStats(MonthStats):
    """Day stats model."""

    day = models.IntegerField()


@receiver(pre_save, sender=NeedLocation)
def add_stats(sender, instance, **kwargs):
    """Need location post save hook which add stats."""
    now = datetime.now()

    allneedscount = len(instance.needs)
    allansweredneedscount = 0

    oldinstance = sender.objects.get(id=instance.id)

    if oldinstance is not None:

        instanceneeds = set(need.name for need in instance.needs)
        oldneeds = set(need.name for need in oldinstance.needs)

        newneeds = instanceneeds - oldneeds
        answeredneeds = oldneeds - instanceneeds

        allneedscount = len(newneeds)
        allansweredneedscount = len(answeredneeds)

    def addstats(
            cls,
            allneedscount=allneedscount,
            allansweredneedscount=allansweredneedscount, **kwargs
    ):
        """Add a stats object in database related to input needlocation."""
        stats = cls.objects.get(**kwargs)

        if stats is None:
            cls.objects.create(
                allneeds=allneedscount, allansweredneeds=allansweredneedscount,
                **kwargs
            )

        else:
            stats.__iadd__('allneeds', allneedscount)
            stats.__iadd__('allansweredneeds', allansweredneedscount)

            stats.save()

    addstats(Stats)
    addstats(YearStats, year=now.year)
    addstats(MonthStats, year=now.year, month=now.month)
    addstats(DayStats, year=now.year, month=now.month, day=now.day)
