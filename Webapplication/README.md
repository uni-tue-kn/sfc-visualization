0. Create virtual environment:

- poetry/anaconda ...
- poetry init
- poetry install
- poetry run django-admin...

1. Install Angular:

- npm install -g @angular/cli@12.2.11

2. Install Django:

- poetry add django
- poetry add djangorestframework
- poetry add django-cors-headers

3. Install d3.js:

- npm install d3 && npm install @types/d3 --save-dev

4. Create Django project:
-poetry run django-admin startproject <djangoproject>
-test it: cd djangoproject, poetry run python manage.py runserver

5. Changes in Django settings:

- add corsheaders to middleware and installed_apps
- whitelist cors origin

6. Create Djangoapp:

- poetry run python manage.py startapp <backendapp>
- add rest_framework and appconfig to installed app in the settings
- define data models in models.py
- make migrations to database: poetry run python manage.py makemigrations backendapp, poetry run python manage.py migrate backendapp 
- add serializers.py, import serializers from rest_framework (optional)
- add API-functions to views.py
- add url patterns in url.py in backendapp



6. Create Angular project:

- poetry run ng <newproject>
- poetry run ng new frontendapp
- poetry run ng generate component svg
- poetry run ng generate service backendinterface
