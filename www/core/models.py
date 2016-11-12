"""Model module."""

from django.db import models
# from django.contrib.gis.db import models

from django.db.models.signals import pre_save, post_save
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
    longitude = models.FloatField()
    latitude = models.FloatField()
    needlocations = models.ManyToManyField(NeedLocation)
    enddatetime = models.DateTimeField(null=False)

    def __str__(self):
        """representation."""
        return obj2str(
            self, 'name', 'description', 'needlocations', 'enddatetime'
        )


class Stats(models.Model):
    """Stats model."""

    needs = models.IntegerField(default=0)
    answeredneeds = models.IntegerField(default=0)
    roams = models.IntegerField(default=0)

    year = models.IntegerField()
    month = models.IntegerField()
    day = models.IntegerField()


@receiver(post_save, sender=Roam)
def add_roam(sender, instance, **kwargs):
    """Add roam count in stats."""
    now = datetime.now()
    statskwargs = {'year': now.year, 'month': now.month, 'day': now.day}
    stats = Stats.objects.get(**statskwargs)

    if stats is None:
        Stats.objects.create(roams=1, **statskwargs)

    else:
        stats.__iadd__('roams', 1)
        stats.save()


@receiver(pre_save, sender=NeedLocation)
def add_stats(sender, instance, **kwargs):
    """Need location post save hook which add stats."""
    needscount = len(instance.needs)
    answeredneedscount = 0

    oldinstance = sender.objects.get(id=instance.id)

    if oldinstance is not None:

        instanceneeds = set(need.name for need in instance.needs)
        oldneeds = set(need.name for need in oldinstance.needs)

        newneeds = instanceneeds - oldneeds
        answeredneeds = oldneeds - instanceneeds

        needscount = len(newneeds)
        answeredneedscount = len(answeredneeds)

    now = datetime.now()
    statskwargs = {'year': now.year, 'month': now.month, 'day': now.day}
    stats = Stats.objects.get(**statskwargs)

    if stats is None:
        Stats.objects.create(
            allneeds=needscount, allansweredneeds=answeredneedscount,
            **statskwargs
        )

    else:
        stats.__iadd__('needs', needscount)
        stats.__iadd__('answeredneeds', answeredneedscount)
        stats.save()
