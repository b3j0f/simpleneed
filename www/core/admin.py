"""administration module."""

from django.contrib import admin

from .models import (
    Gender, Mood, Need, NeedLocation, Contact, Roam, Stats, YearStats,
    MonthStats, DayStats
)

# Register your models here.
admin.site.register(Gender)
admin.site.register(Mood)
admin.site.register(Need)
admin.site.register(Contact)
admin.site.register(NeedLocation)
admin.site.register(Roam)
admin.site.register(Stats)
admin.site.register(YearStats)
admin.site.register(MonthStats)
admin.site.register(DayStats)
