# Generated by Django 4.2.6 on 2023-11-12 22:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('friend_list', '0004_alter_friendlist_friend2'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='friendlist',
            options={'verbose_name': 'friend_list', 'verbose_name_plural': 'friend_list'},
        ),
        migrations.AlterModelTableComment(
            name='friendlist',
            table_comment='Implementation of a friendlist between users on the website',
        ),
        migrations.AddConstraint(
            model_name='friendlist',
            constraint=models.UniqueConstraint(fields=('friend1', 'friend2'), name='unique_rows_friend'),
        ),
        migrations.AddConstraint(
            model_name='friendlist',
            constraint=models.CheckConstraint(check=models.Q(('friend1', models.F('friend2')), _negated=True), name='cannot_friend_yourself'),
        ),
    ]
