# Generated by Django 2.1.2 on 2018-12-13 19:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Zoopla', '0013_auto_20181213_1949'),
    ]

    operations = [
        migrations.CreateModel(
            name='RentalPrice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('accurate', models.CharField(max_length=30, null=True)),
                ('per_month', models.FloatField()),
                ('per_week', models.FloatField()),
                ('shared_occupancy', models.CharField(max_length=30)),
                ('zoopla_property', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Zoopla.Property')),
            ],
        ),
    ]
