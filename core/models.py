from django.db import models

from enum import IntEnum, unique


@unique
class Feeling(IntEnum):
	happy = 1
	neutral = 2
	bad = 3


class HomelessNeed(models.Model):

	name = models.CharField(max_length=32, primary_key=True)
	img = models.ImageField()

	def __str__(self):

		return 'HomelessNeed({0}, {1})'.format(self.name, self.img)


class HomelessSituation(models.Model):

	location = models.CharField(max_length=32)
	feeling = models.EnumField(Feeling)
	comment = models.CharField(max_length=256)
	needs = models.ManyToMany(HomelessNeed)

	def __str__(self):

		return 'HomelessSituation({0}, {1}, {2})'.format(
			self.location, self.feeling, self.comment, self.needs
		)


class HelpContact(models.Model):

	country = models.CharField(max_length=60)
	number = models.CharField(max_length=15)

	def __str__(self):

		return 'HelpContact({0}, {1})'.format(country, number)
