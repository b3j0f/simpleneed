from django.contrib import admin

from .models import Gender, Mood, Need, Homeless, HelpContact

# Register your models here.
admin.sites.register(Gender)
admin.sites.register(Mood)
admin.sites.register(Need)
admin.sites.register(HelpContact)
admin.sites.register(Homeless)
