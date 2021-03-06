# Generated by Django 2.1.2 on 2019-02-10 15:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HereMaps', '0002_routecache'),
    ]

    operations = [
        migrations.RenameField(
            model_name='routecache',
            old_name='latitude',
            new_name='start_latitude',
        ),
        migrations.RenameField(
            model_name='routecache',
            old_name='longitude',
            new_name='start_longitude',
        ),
        migrations.AddField(
            model_name='routecache',
            name='des_latitude',
            field=models.DecimalField(decimal_places=6, default=0, max_digits=9),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='routecache',
            name='des_longitude',
            field=models.DecimalField(decimal_places=6, default=0, max_digits=9),
            preserve_default=False,
        ),
    ]
