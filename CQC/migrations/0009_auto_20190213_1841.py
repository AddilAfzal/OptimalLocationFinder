# Generated by Django 2.1.2 on 2019-02-13 18:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('CQC', '0008_auto_20190213_1840'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cqclocation',
            old_name='last_inspection',
            new_name='last_inspection_date',
        ),
    ]
