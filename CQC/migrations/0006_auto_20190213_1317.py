# Generated by Django 2.1.2 on 2019-02-13 13:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CQC', '0005_auto_20190213_1314'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cqclocation',
            name='location_type',
            field=models.CharField(max_length=600),
        ),
    ]