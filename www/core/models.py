"""Model module."""

from django.db import models
# from django.contrib.gis.db import models

from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils.timezone import now

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


class LocatedElement(models.Model):
    """abstract model for located elements."""

    longitude = models.FloatField()
    latitude = models.FloatField()
    description = models.TextField()
    enddatetime = models.DateTimeField(null=False)
    people = models.IntegerField(default=1)

    @property
    def child(self):
        """Get child object."""
        return self.rroam or self.rneedlocation

    def __str__(self):
        """representation."""
        return obj2str(
            self,
            'longitude', 'latitude', 'description', 'enddatetime', 'people',
            'rroam', 'rneedlocation'
        )


class Message(models.Model):
    """Message model."""

    element = models.ForeignKey(LocatedElement)
    content = models.TextField(null=False)
    datetime = models.DateTimeField(default=now)

    def __str__(self):
        """representation."""
        return obj2str(self, 'element', 'content', 'datetime')


class Roam(LocatedElement):
    """Roam model."""

    name = models.CharField(max_length=256)
    base = models.OneToOneField(
        LocatedElement, parent_link=True, related_name='rroam'
    )

    def __str__(self):
        """representation."""
        return obj2str(self, 'name', 'description', 'enddatetime', 'people')


class NeedLocation(LocatedElement):
    """need location model."""

    # location = models.PointField()

    mood = models.ForeignKey(Mood, default='neutral')
    needs = models.ManyToManyField(Need)
    handicapped = models.BooleanField(default=False)
    sick = models.BooleanField(default=False)
    gender = models.ForeignKey(Gender, default='other')
    roam = models.ForeignKey(Roam, null=True, default=None)
    base = models.OneToOneField(
        LocatedElement, parent_link=True, related_name='rneedlocation'
    )

    def __str__(self):
        """representation."""
        return obj2str(
            self,
            'latitude', 'longitude', 'mood', 'description',
            'needs', 'handicapped', 'gender', 'enddatetime', 'people',
            'roam'
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
    people = instance.people

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
            allneeds=needscount * people,
            allansweredneeds=answeredneedscount * people,
            **statskwargs
        )

    else:
        stats.__iadd__('needs', needscount * people)
        stats.__iadd__('answeredneeds', answeredneedscount * people)
        stats.save()
