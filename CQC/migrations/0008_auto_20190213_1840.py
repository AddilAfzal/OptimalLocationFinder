# Generated by Django 2.1.2 on 2019-02-13 18:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CQC', '0007_cqclocation_overall_rating'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cqclocation',
            old_name='overall_rating',
            new_name='last_rating',
        ),
        migrations.AddField(
            model_name='cqclocation',
            name='last_inspection',
            field=models.DateTimeField(null=True),
        ),
    ]
