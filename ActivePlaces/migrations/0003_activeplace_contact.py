# Generated by Django 2.1.2 on 2019-02-24 13:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ActivePlaces', '0002_auto_20190224_1252'),
    ]

    operations = [
        migrations.AddField(
            model_name='activeplace',
            name='contact',
            field=models.OneToOneField(default=None, on_delete=django.db.models.deletion.DO_NOTHING, to='ActivePlaces.Contacts'),
            preserve_default=False,
        ),
    ]
