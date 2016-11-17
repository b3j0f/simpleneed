MANAGE:=python manage.py

INSTALL:= pip install -r

all: clean rundev

clean:
	rm -rf core/migrations/0*

cleandev: clean
	rm -rf db.sql

cleanprod: clean
	$(MANAGE) flush

settingsdev:
	$DJANGO_SETTINGS="simpleneed/settings-dev.py"

settingsprod:
	$DJANGO_SETTINGS="simpleneed/settings-prod.py"

dependenciesdev:
	$(INSTALL) requirements-dev.txt

dependenciesprod:
	$(INSTALL) requirements-prod.txt

migrations:
	$(MANAGE) makemigrations

migrate: migrations
	$(MANAGE) migrate

loaddata:
	$(MANAGE) loaddata core/fixtures/*

run:
	$(MANAGE) collectstatic

runprod: settingsprod dependenciesprod migrate loaddata
	$(MANAGE) collectstatic
	$(MANAGE) runserver 0.0.0.0:80

rundev: settingsdev dependenciesdev migrate loaddata
	$(MANAGE) runserver
