PLATFORM := dev
BIND := 127.0.0.1:8000
DJANGO_SETTINGS_MODULE := "web.settings.$(PLATFORM)"


.PHONY: all
all: migrations migrate fixtures

.PHONY: migrations
migrations:
	python manage.py makemigrations simpleneed

.PHONY: migrate
migrate:
	python manage.py migrate

.PHONY: fixtures
fixtures:
	python manage.py loaddata needs

.PHONY: superuser
superuser:
	python manage.py loaddata users

.PHONY: static
static:
	python manage.py collectstatic

.PHONY: run
run: static
	python manage.py runserver $(BIND)

.PHONY: runcelery
runcelery:
	celery --app=simpleneed.celery:app worker --loglevel=DEBUG

.PHONY: runshell
shell:
	python manage.py shell

.PHONY: install_deps
install_deps:
	pip install -r requirements/$(PLATFORM).txt

.PHONY: clean
clean:
	rm -rf www/*
	python manage.py dump > dump
	python manage.py flush
	rm db.sql3
