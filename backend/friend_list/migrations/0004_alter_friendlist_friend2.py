# Generated by Django 4.2.6 on 2023-11-06 21:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0003_alter_user_status'),
        ('friend_list', '0003_friendlist_friend2'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friendlist',
            name='friend2',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend2', to='user_profile.user'),
        ),
    ]
