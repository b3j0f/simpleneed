"""Dev setttings."""

from django.db import connection
connection.connection.text_factory = lambda x: unicode(x, "utf-8", "ignore")

from .settings import *
