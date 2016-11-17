MANAGE:=python manage.py

INSTALL:= pip install -r

all: clean rundev

test: cleandev settingsdev dependenciesdev migrate loaddata
	$(MANAGE) test

clean:
	rm -rf core/migrations/0*

cleandev: clean
	rm -rf db.sqlite

cleanprod: clean
	$(MANAGE) flush

settingsdev:
	export DJANGO_SETTINGS_MODULE="simpleneed/settings-dev.py"

settingsprod:
	export DJANGO_SETTINGS_MODULE="simpleneed/settings-prod.py"

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

runprod: settingsprod dependenciesprod migrate loaddata
	$(MANAGE) collectstatic
	$(MANAGE) runserver 0.0.0.0:80

rundev: settingsdev dependenciesdev migrate loaddata
	$(MANAGE) runserver
