# Generated by Django 2.1.2 on 2019-02-13 12:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CQCLocation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('postcode', models.CharField(max_length=8)),
                ('street', models.CharField(max_length=100, null=True)),
                ('locality', models.CharField(max_length=60, null=True)),
                ('town', models.CharField(max_length=60, null=True)),
                ('lng', models.DecimalField(decimal_places=6, max_digits=9)),
                ('lat', models.DecimalField(decimal_places=6, max_digits=9)),
                ('cqc_id', models.IntegerField(null=True)),
                ('website', models.URLField(null=True)),
                ('location_type', models.CharField(max_length=50)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]