FROM python:3.9
# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONUNBUFFERED 1
# create root directory for our project in the container
RUN mkdir /mentors-of-color-backend
# Set the working directory to /mentors-of-color-backend
WORKDIR /mentors-of-color-backend
# Copy the current directory contents into the container at /mentors-of-color-backend
ADD . /mentors-of-color-backend/
# Install any needed packages specified in requirements.txt
COPY . .
RUN pip install -r requirements.txt

# CMD exec gunicorn config.wsgi:application — bind 0.0.0.0:8000  — workers 3
EXPOSE 8000 
EXPOSE 6379 
# start server 
CMD python manage.py migrate --settings=config.settings.base && python manage.py runserver --settings=config.settings.base 0.0.0.0:8000

# RUN chmod 777 /mentors-of-color-backend/entrypoint.sh
# ENTRYPOINT ["/mentors-of-color-backend/entrypoint.sh"]
# CMD ["run"]