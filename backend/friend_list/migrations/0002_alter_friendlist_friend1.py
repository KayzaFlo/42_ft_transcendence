# Generated by Django 4.2.6 on 2023-11-06 21:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0003_alter_user_status'),
        ('friend_list', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friendlist',
            name='friend1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend1', to='user_profile.user'),
        ),
    ]
