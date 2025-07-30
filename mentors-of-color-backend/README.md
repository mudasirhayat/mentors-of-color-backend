# Mentors of Color Backend

## Technologies
- Python 3.9
- Django 4.2
- Django REST Framework
- Postgres
- Flake8


## Running Locally

### Requirements

- Postgres: [Postgres Mac App](http://postgresapp.com/) or [Postgres CLI](https://formulae.brew.sh/formula/postgresql#default)
- Python version 3.9.6 (use [virtualenv](https://docs.python.org/3/library/venv.html) to manage your Python versions)


### First Time Setup

1. Clone repo and cd into directory
1. Create virtual environment: `python -m venv venv` (you could also use Poetry for this step, but I think it's easier this way)
1. Run: `source venv/bin/activate`
1. Database setup from terminal (`psql postgres -U [username]`):
    1. Create the database: `CREATE DATABASE duett;`
    1. Create DB user: `CREATE USER duett_admin;`
    1. Grant privilages to user for our database: `GRANT ALL PRIVILEGES ON DATABASE duett TO duett_admin;`
1. Run migrations: `python manage.py migrate --settings=config.settings.base`
1. Create an admin user for logging into the Django admin interface: `python manage.py createsuperuser --settings=config.settings.base`


### Running the App

1. Make sure you are already in your virtual environment: `source venv/bin/activate`
1. Run the app: `python manage.py runserver --settings=config.settings.base`
1. View the API at http://localhost:8000 and the admin interface at http://localhost:8000/admin

## Development Instructions

**Add New App**

1. `mkdir moc_api/[app_name]`
1. `python manage.py startapp [app_name] moc_api/[app_name]`
1. Add app to `LOCAL_APPS` list in `config/settings/base.py`
