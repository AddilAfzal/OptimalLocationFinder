# Generated by Django 2.1.2 on 2019-02-24 15:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ActivePlaces', '0004_auto_20190224_1501'),
    ]

    operations = [
        migrations.AlterField(
            model_name='disability',
            name='access',
            field=models.BooleanField(null=True),
        ),
    ]
