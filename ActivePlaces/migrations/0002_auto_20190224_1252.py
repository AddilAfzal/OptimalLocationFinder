# Generated by Django 2.1.2 on 2019-02-24 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ActivePlaces', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='equipment',
            name='balanceBeam',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='equipment',
            name='bowlingMachine',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='equipment',
            name='highBars',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='equipment',
            name='parallelBars',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='equipment',
            name='pommelHorse',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='equipment',
            name='poolHoist',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='equipment',
            name='stillRings',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='equipment',
            name='tableTennisTables',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='equipment',
            name='trampolines',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='equipment',
            name='unevenBars',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='equipment',
            name='vault',
            field=models.IntegerField(default=0),
        ),
    ]
