# Generated by Django 4.2.10 on 2024-03-26 20:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import simple_history.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(db_constraint=False, on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('phone', models.CharField(blank=True, max_length=16, null=True)),
                ('username', models.CharField(max_length=30)),
                ('profile_photo_url', models.CharField(blank=True, max_length=200, null=True)),
                ('online_status', models.BooleanField(blank=True, null=True)),
                ('birth_date', models.DateField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='historicaluser',
name = 'last_activity_date'
field = models.DateField(blank=True, null=True)
        ),
        migrations.AddField(
            model_name='user',
            name='last_activity_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name='HistoricalUserProfile',
            fields=[
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('updated_at', models.DateTimeField(blank=True, editable=False)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('phone', models.CharField(blank=True, max_length=16, null=True)),
                ('username', models.CharField(max_length=30)),
                ('profile_photo_url', models.CharField(blank=True, max_length=200, null=True)),
                ('online_status', models.BooleanField(blank=True, null=True)),
                ('birth_date', models.DateField()),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical user profile',
                'verbose_name_plural': 'historical user profiles',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
    ]
