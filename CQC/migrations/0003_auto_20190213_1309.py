# Generated by Django 2.1.2 on 2019-02-13 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CQC', '0002_auto_20190213_1306'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cqclocation',
            name='location_type',
            field=models.CharField(max_length=250),
        ),
    ]
