# Generated by Django 2.1.2 on 2019-02-17 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Demographic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('borough', models.CharField(max_length=50)),
                ('age', models.IntegerField(null=True)),
                ('ethnic_group', models.CharField(max_length=60)),
                ('population_2018', models.IntegerField()),
                ('population_2019', models.IntegerField()),
            ],
        ),
    ]
