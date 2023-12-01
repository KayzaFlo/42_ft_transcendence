# Generated by Django 4.1.13 on 2023-11-28 18:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user_profile', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MatchHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('winner_score', models.IntegerField()),
                ('loser_score', models.IntegerField()),
                ('date_of_match', models.TimeField(auto_now=True)),
                ('loser', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='loser', to='user_profile.user')),
                ('winner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='winner', to='user_profile.user')),
            ],
            options={
                'verbose_name': 'match_history',
                'verbose_name_plural': "match_history's",
            },
        ),
        migrations.AddConstraint(
            model_name='matchhistory',
            constraint=models.CheckConstraint(check=models.Q(('winner', models.F('loser')), _negated=True), name='Winner and loser are the same user'),
        ),
    ]
