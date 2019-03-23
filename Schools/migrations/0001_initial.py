# Generated by Django 2.1.2 on 2018-12-12 19:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='OfstedInspection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inspection_date', models.DateTimeField(null=True)),
                ('publication_date', models.DateTimeField(null=True)),
                ('overall_effectiveness', models.IntegerField(choices=[(1, 'Outstanding'), (2, 'Good'), (3, 'Requires Improvement'), (4, 'Inadequate')])),
            ],
        ),
        migrations.CreateModel(
            name='School',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('postcode', models.CharField(max_length=8)),
                ('street', models.CharField(max_length=100)),
                ('locality', models.CharField(max_length=50, null=True)),
                ('town', models.CharField(max_length=50)),
                ('lng', models.DecimalField(decimal_places=6, max_digits=9)),
                ('lat', models.DecimalField(decimal_places=6, max_digits=9)),
                ('urn', models.IntegerField()),
                ('other_name', models.CharField(max_length=100)),
                ('phone', models.CharField(max_length=20)),
                ('is_new', models.BooleanField(default=False)),
                ('is_primary', models.BooleanField(default=False)),
                ('is_secondary', models.BooleanField(default=False)),
                ('is_post16', models.BooleanField(default=False)),
                ('age_from', models.IntegerField()),
                ('age_to', models.IntegerField()),
                ('gender', models.CharField(choices=[('B', 'Boys'), ('G', 'Girls'), ('M', 'Mixed')], default='M', max_length=2)),
                ('sixth_form_gender', models.CharField(choices=[('B', 'Boys'), ('G', 'Girls'), ('M', 'Mixed')], default='M', max_length=2)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='ofstedinspection',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Schools.School'),
        ),
    ]