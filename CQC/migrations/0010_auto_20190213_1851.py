# Generated by Django 2.1.2 on 2019-02-13 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CQC', '0009_auto_20190213_1841'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cqclocation',
            name='last_inspection_date',
            field=models.DateField(null=True),
        ),
    ]
