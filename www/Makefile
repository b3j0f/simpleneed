MANAGE:=python manage.py

INSTALL:= pip install -r

all: clean test rundev

test: clean settingsdev dependenciesdev loaddata
	$(MANAGE) test

clean:
	$(MANAGE) flush

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

loaddata: migrate
	$(MANAGE) loaddata simpleneed/fixtures/*

runprod: settingsprod dependenciesprod loaddata
	$(MANAGE) collectstatic
	$(MANAGE) runserver 0.0.0.0:80

rundev: settingsdev dependenciesdev loaddata
	$(MANAGE) runserver 0.0.0.0:8000

commit:
	git add ..
	git commit
	git push origin master
