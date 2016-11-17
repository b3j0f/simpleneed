from __future__ import unicode_literals

from django.test import TestCase

from .models import NeedLocation, Roam, Message, Stats, Need, currentdatets

from unittest import TestCase, main

from time import time

from md5 import md5


# Create your tests here.
class NeedLocationTest(TestCase):

    def test_clean(self):

        model = NeedLocation(latitude=1, longitude=2)

        startts = model.startts
        endts = model.endts

        model.save()

        self.assertEqual(startts, model.startts)
        self.assertEqual(endts, model.endts)

        need = Need(name='test')

        need.save()

        model.needs.add(need)

        model.save()

        self.assertEqual(startts, model.startts)
        self.assertEqual(endts, model.endts)

        model.needs.clear()

        model.save()

        self.assertEqual(startts, model.startts)
        self.assertNotEqual(endts, model.endts)

        model.delete()
        need.delete()

    def test_newpwd(self):

        model = NeedLocation(longitude=1, latitude=2)

        self.assertFalse(model.pwd)

        model.save()

        self.assertFalse(model.pwd)

        model.pwd = 'test'

        model.save()

        self.assertEqual(model.pwd, md5('test').digest())

        model.delete()

    def test_pwd(self):

        model = NeedLocation(longitude=1, latitude=2, pwd=u'test')

        model.save()

        model.pwd = 'test'

        model.save()

        model.pwd = 'ex'

        self.assertRaises(ValueError, model.save)


class RoamTest(TestCase):

    def test_newpwd(self):

        model = Roam(longitude=1, latitude=2, name='test')

        self.assertFalse(model.pwd)

        model.save()

        self.assertFalse(model.pwd)

        model.pwd = 'test'

        model.save()

        self.assertEqual(model.pwd, md5('test').digest())

        model.delete()

    def test_pwd(self):

        model = Roam(longitude=1, latitude=2, name='test', pwd=u'test')

        model.save()

        model.pwd = 'test'

        model.save()

        model.pwd = 'ex'

        self.assertRaises(ValueError, model.save)

    def test_roamstats(self):

        try:
            stats = Stats.objects.get(pk=currentdatets())

        except Stats.DoesNotExist:
            model = Roam(longitude=1, latitude=2, name='test')
            model.save()
            stats = Stats.objects.get(pk=currentdatets())

        else:
            model = Roam(longitude=1, latitude=2, name='test')
            model.save()

        newstats = Stats.objects.get(pk=currentdatets())

        self.assertEqual(stats.roams + 1, newstats.roams)


if __name__ == '__main__':
    main()
