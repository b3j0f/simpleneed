"""Model module."""

from django.db import models
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

from datetime import datetime as datetime, date

from time import time, mktime

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


def add4hours():
    """Add 4 hours to currend datetime."""
    return time() + 4 * 3600


class LocatedElement(models.Model):
    """abstract model for located elements."""

    longitude = models.FloatField(null=False)
    latitude = models.FloatField(null=False)
    description = models.TextField(default='')
    startts = models.FloatField(default=time)
    endts = models.FloatField(default=add4hours)
    people = models.IntegerField(default=1)
    pwd = models.CharField(max_length=32, default='')

    @property
    def utcstartdatetime(self):
        """Get start datetime."""
        return datetime.utcfromtimestamp(self.startts)

    @property
    def utcenddatetime(self):
        """Get start datetime."""
        return datetime.utcfromtimestamp(self.endts)

    @property
    def child(self):
        """Get child object."""
        return self.rroam or self.rneedlocation

    @property
    def haspwd(self):
        """True if this has a password."""
        return bool(self.pwd)

    def __str__(self):
        """representation."""
        return obj2str(
            self,
            'longitude', 'latitude', 'description', 'startts', 'endts',
            'people', 'rroam', 'rneedlocation',
            'utcstartdatetime', 'utcenddatetime', 'haspwd'
        )


class Message(models.Model):
    """Message model."""

    element = models.ForeignKey(
        LocatedElement, null=False, related_name='messages'
    )
    content = models.TextField(null=False)
    ts = models.FloatField(default=time)

    @property
    def utcdatetime(self):
        """Get datetime."""
        return datetime.utcfromtimestamp(self.ts)

    def __str__(self):
        """representation."""
        return obj2str(self, 'element', 'content', 'ts', 'utcdatetime')


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
            'name', 'description', 'startts', 'endts', 'people'
            'utcstartdatetime', 'utcenddatetime',
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
            'needs', 'handicapped', 'gender', 'startts', 'endts',
            'people', 'roam',
            'startdatetime', 'enddatetime',
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


def currentdatets():
    """Get current date timestamp."""
    return mktime(date.today())


class Stats(models.Model):
    """Stats model."""

    ts = models.IntegerField(default=currentdatets, primary_key=True)

    needs = models.IntegerField(default=0)
    answeredneeds = models.IntegerField(default=0)
    roams = models.IntegerField(default=0)

    def utcdate(self):
        """Get utc date."""
        return datetime.utcfromtimestamp(self.ts)

    def __str__(self):
        """representation."""
        return obj2str(
            self, 'ts', 'needs', 'answeredneeds', 'roams', 'utcdate'
        )


@receiver(pre_save, sender=NeedLocation)
def checkneeds(sender, instance, **kwargs):
    """If needs are empty, set enddatetime to at most now."""
    if not instance.needs:
        now = time()

        if now < instance.endts:
            instance.endts = now


@receiver(pre_save, sender=LocatedElement)
def checkkey(sender, instance, **kwargs):
    """Check pwd."""
    old = LocatedElement.objects.get(id=instance.id)

    if old is None:
        if instance.haspwd:
            instance.pwd = md5(instance.pwd).digest()

    elif old.haspwd:

        pwd = md5(instance.pwd).digest()

        if old.pwd != pwd:
            raise KeyError('Wrong pwd in {0}'.format(instance))

        instance.pwd = pwd


@receiver(post_save, sender=Roam)
def addroamstats(sender, instance, **kwargs):
    """Add roam count in stats."""
    todayts = currentdatets()
    stats = Stats.objects.get(ts=todayts)

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

    todayts = currentdatets()
    stats = Stats.objects.get(ts=todayts)

    if stats is None:
        Stats.objects.create(
            allneeds=needscount * people,
            allansweredneeds=answeredneedscount * people
        )

    else:
        stats.__iadd__('needs', needscount * people)
        stats.__iadd__('answeredneeds', answeredneedscount * people)
        stats.save()
