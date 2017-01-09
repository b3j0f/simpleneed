"""Model module."""

from django.db import models
from django.db.models import F
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils.encoding import python_2_unicode_compatible
from django.contrib.auth.models import User

from datetime import datetime as datetime, date

from time import time, mktime

from md5 import md5

from .utils import obj2str


@python_2_unicode_compatible
class Profile(models.Model):
    """Profile model."""

    user = models.OneToOneField(User)

    def __str__(self):
        """Representation."""
        return self.user.username


@python_2_unicode_compatible
class Mood(models.Model):
    """Mood model."""

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):
        """representation."""
        return 'Mood({0})'.format(self.name)


@python_2_unicode_compatible
class Need(models.Model):
    """Need model."""

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):
        """representation."""
        return 'Need({0})'.format(self.name)


@python_2_unicode_compatible
class Gender(models.Model):
    """Gender model."""

    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):
        """representation."""
        return 'Gender({0})'.format(self.name)


def add8hours():
    """Add 4 hours to currend datetime."""
    return time() + 8 * 3600


@python_2_unicode_compatible
class LocatedElement(models.Model):
    """abstract model for located elements."""

    longitude = models.FloatField(null=False, blank=False)
    latitude = models.FloatField(null=False, blank=False)
    description = models.TextField(default='', blank=True)
    startts = models.FloatField(default=time, blank=True)
    endts = models.FloatField(default=add8hours, blank=True)
    people = models.IntegerField(default=1, blank=True)
    pwd = models.CharField(max_length=32, default='', blank=True)
    needs = models.ManyToManyField(Need, blank=True, default=[])

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
        """Get child object. Self if not locatedelement."""
        return self.rroam or self.rneedlocation or self.rsupplylocation

    @property
    def type(self):
        """Get type name."""
        return type(self.child).__name__

    @property
    def haspwd(self):
        """True if this has a password."""
        return bool(self.pwd)

    def __str__(self):
        """Representation."""
        return '{0}'.format(self.id)


@python_2_unicode_compatible
class Message(models.Model):
    """Message model."""

    element = models.ForeignKey(
        LocatedElement, related_name='messages', blank=True, null=True
    )
    content = models.TextField(blank=False)
    ts = models.FloatField(default=time, blank=True)

    @property
    def utcdatetime(self):
        """Get datetime."""
        return datetime.utcfromtimestamp(self.ts)

    def __str__(self):
        """representation."""
        result = 'Message('

        if self.element:
            result += 'element: {0}, '.format(self.element)

        if self.content:
            result += 'content: {0}, '.format(self.content)

        if self.ts:
            result += 'ts: {0}, '.format(self.ts)

        return result + ')'


@python_2_unicode_compatible
class Roam(LocatedElement):
    """Roam model."""

    name = models.CharField(max_length=256, null=False, blank=False)
    base = models.OneToOneField(
        LocatedElement, parent_link=True, related_name='rroam', blank=True
    )

    def __str__(self):
        """representation."""
        return 'Roam({0})'.format(self.name)


# @python_2_unicode_compatible
class NeedLocation(LocatedElement):
    """Need location model."""

    emergency = models.BooleanField(default=False, blank=True)
    roam = models.ForeignKey(
        Roam, blank=True, default=None, related_name='needlocations', null=True
    )
    base = models.OneToOneField(
        LocatedElement, parent_link=True, related_name='rneedlocation',
        null=False, blank=True
    )


class SupplyLocation(LocatedElement):
    """Supply location model."""

    base = models.OneToOneField(
        LocatedElement, parent_link=True, related_name='rsupplylocation',
        null=False, blank=True
    )


class Follower(models.Model):
    """Located element followers."""

    follow = models.ManyToManyField(LocatedElement)


@python_2_unicode_compatible
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
    return mktime(date.today().timetuple())


class Stats(models.Model):
    """Stats model."""

    ts = models.IntegerField(default=currentdatets, primary_key=True)

    needs = models.IntegerField(default=0)
    answeredneeds = models.IntegerField(default=0)
    roams = models.IntegerField(default=0)
    supplies = models.IntegerField(default=0)

    def utcdate(self):
        """Get utc date."""
        return datetime.utcfromtimestamp(self.ts)

    def __str__(self):
        """representation."""
        return obj2str(
            self, 'ts', 'needs', 'answeredneeds', 'roams', 'utcdate'
        )


@receiver(pre_save, sender=NeedLocation)
@receiver(pre_save, sender=SupplyLocation)
@receiver(pre_save, sender=Roam)
@receiver(pre_save, sender=LocatedElement)
def cleanneedlocation(sender, instance, **kwargs):
    """If needs are empty, set enddatetime to at most now."""
    now = time()

    if instance.id is not None:

        if not instance.needs.all():
            instance.endts = now


@receiver(pre_save, sender=NeedLocation)
@receiver(pre_save, sender=Roam)
@receiver(pre_save, sender=SupplyLocation)
def checkkey(sender, instance, **kwargs):
    """Check pwd."""
    try:
        old = type(instance).objects.get(pk=instance.id)

    except type(instance).DoesNotExist:
        if instance.haspwd:
            instance.pwd = md5(instance.pwd).digest()

    else:
        print(instance.pwd)
        if old.haspwd:
            pwd = md5(instance.pwd).digest()

            if old.pwd != pwd:
                raise ValueError('Wrong pwd in {0}'.format(instance))

            instance.pwd = pwd

        elif instance.haspwd:
            instance.pwd = md5(instance.pwd).digest()


@receiver(pre_save, sender=SupplyLocation)
def addsuppliesstats(sender, instance, **kwargs):
    """Add roam count in stats."""
    if instance.id is None:
        todayts = currentdatets()

        rows = Stats.objects.filter(pk=todayts).update(
            supplies=F('supplies') + 1
        )

        if rows == 0:
            Stats.objects.create(supplies=1)


@receiver(pre_save, sender=Roam)
def addroamstats(sender, instance, **kwargs):
    """Add roam count in stats."""
    if instance.id is None:
        todayts = currentdatets()

        rows = Stats.objects.filter(pk=todayts).update(roams=F('roams') + 1)

        if rows == 0:
            Stats.objects.create(roams=1)


@receiver(post_save, sender=NeedLocation)
def addneedlocationstats(sender, instance, **kwargs):
    """Need location post save hook which add stats."""
    needscount = len(instance.needs.all())
    answeredneedscount = 0
    people = instance.people

    try:
        oldinstance = sender.objects.get(pk=instance.id)

    except NeedLocation.DoesNotExist:
        instanceneeds = set(need.name for need in instance.needs.all())
        oldneeds = set(need.name for need in oldinstance.needs.all())

        newneeds = instanceneeds - oldneeds
        answeredneeds = oldneeds - instanceneeds

        needscount = len(newneeds)
        answeredneedscount = len(answeredneeds)

    todayts = currentdatets()

    rows = Stats.objects.filter(pk=todayts).update(
        needs=F('needs') + needscount + people,
        answeredneeds=F('answeredneeds') + needscount + people
    )

    if rows == 0:
        Stats.objects.create(
            needs=needscount * people,
            answeredneeds=answeredneedscount * people
        )
