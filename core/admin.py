from django.contrib import admin

from .models import Gender, Mood, Need, Homeless, Contact

# Register your models here.
admin.site.register(Gender)
admin.site.register(Mood)
admin.site.register(Need)
admin.site.register(Contact)
admin.site.register(Homeless)
