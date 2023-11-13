# Generated by Django 4.2.6 on 2023-11-05 20:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nickname', models.CharField(max_length=50)),
                ('email', models.TextField()),
                ('avatar', models.TextField()),
                ('status', models.CharField(choices=[('O', 'Online'), ('OF', 'Offline'), ('I', 'Ingame'), ('B', 'Busy')], default='O', max_length=10)),
                ('admin', models.BooleanField(default=False)),
            ],
        ),
    ]
