# Generated by Django 4.1.13 on 2023-12-19 17:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tournament_history', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournamenthistory',
            name='loser',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='loserTournament', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='tournamenthistory',
            name='winner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='winnerTournament', to=settings.AUTH_USER_MODEL),
        ),
    ]
