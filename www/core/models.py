"""Model module."""

from django.db import models
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils.timezone import now

from datetime import datetime as dt, date

from time import time

from md5 import md5

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

    longitude = models.FloatField(null=False)
    latitude = models.FloatField(null=False)
    description = models.TextField(default='')
    startdatetime = models.DateTimeField(default=dt.now)
    enddatetime = models.DateTimeField(
        default=lambda: dt.fromtimestamp(time() + 4 * 3600)
    )
    people = models.IntegerField(default=1)
    pwd = models.CharField(max_length=32, default='')

    @property
    def child(self):
        """Get child object."""
        return self.rroam or self.rneedlocation

    def __str__(self):
        """representation."""
        return obj2str(
            self,
            'longitude', 'latitude', 'description', 'startdatetime',
            'enddatetime', 'people', 'rroam', 'rneedlocation'
        )


class Message(models.Model):
    """Message model."""

    element = models.ForeignKey(
        LocatedElement, null=False, related_name='messages'
    )
    content = models.TextField(null=False)
    datetime = models.DateTimeField(default=now)

    def __str__(self):
        """representation."""
        return obj2str(self, 'element', 'content', 'datetime')


class Roam(LocatedElement):
    """Roam model."""

    name = models.CharField(max_length=256, null=False)
    base = models.OneToOneField(
        LocatedElement, parent_link=True, related_name='rroam', null=False
    )

    def __str__(self):
        """representation."""
        return obj2str(
            self,
            'name', 'description', 'startdatetime', 'enddatetime', 'people'
        )


class NeedLocation(LocatedElement):
    """need location model."""

    mood = models.ForeignKey(
        Mood, default='neutral', related_name='needlocations'
    )
    needs = models.ManyToManyField(
        Need, blank=True, related_name='needlocations'
    )
    handicapped = models.BooleanField(default=False)
    sick = models.BooleanField(default=False)
    gender = models.ForeignKey(
        Gender, default='other', related_name='needlocations'
    )
    roam = models.ForeignKey(
        Roam, null=True, default=None, related_name='needlocations'
    )
    base = models.OneToOneField(
        LocatedElement, parent_link=True, related_name='rneedlocation',
        null=False
    )

    def __str__(self):
        """representation."""
        return obj2str(
            self,
            'latitude', 'longitude', 'mood', 'description',
            'needs', 'handicapped', 'gender', 'startdatetime', 'enddatetime',
            'people', 'roam'
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

    date = models.DateField(default=date.today, primary_key=True)

    needs = models.IntegerField(default=0)
    answeredneeds = models.IntegerField(default=0)
    roams = models.IntegerField(default=0)


@receiver(pre_save, sender=LocatedElement)
def checkkey(sender, instance, **kwargs):
    """Check pwd."""
    old = LocatedElement.objects.get(id=instance.id)

    pwd = md5(instance.pwd).digest()

    if old and old.pwd != pwd:  # compare md5s
        raise KeyError('Wrong pwd in {0}'.format(instance))

    instance.pwd = pwd  # set md5 value


@receiver(post_save, sender=Roam)
def addroamstats(sender, instance, **kwargs):
    """Add roam count in stats."""
    today = date.today()
    stats = Stats.objects.get(date=today)

    if stats is None:
        Stats.objects.create(roams=1)

    else:
        stats.__iadd__('roams', 1)
        stats.save()


@receiver(pre_save, sender=NeedLocation)
def addneedlocationstats(sender, instance, **kwargs):
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

    today = date.today()
    stats = Stats.objects.get(date=today)

    if stats is None:
        Stats.objects.create(
            allneeds=needscount * people,
            allansweredneeds=answeredneedscount * people
        )

    else:
        stats.__iadd__('needs', needscount * people)
        stats.__iadd__('answeredneeds', answeredneedscount * people)
        stats.save()
