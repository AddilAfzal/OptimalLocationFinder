from django.db import models


class Location(models.Model):
    name = models.CharField(max_length=100)
    postcode = models.CharField(max_length=10)
    street = models.CharField(max_length=100, null=True)
    locality = models.CharField(max_length=60, null=True)
    town = models.CharField(max_length=60, null=True)

    lng = models.DecimalField(max_digits=9, decimal_places=6)
    lat = models.DecimalField(max_digits=9, decimal_places=6)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class Postcode(models.Model):
    postal_code = models.CharField(max_length=9)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    local_authority_name = models.CharField(max_length=50, null=True)
    local_authority_code = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.postal_code


class Demographic(models.Model):
    borough = models.CharField(max_length=50)
    age = models.IntegerField(null=True) # null represents the total count
    ethnic_group = models.CharField(max_length=60)
    population_2018 = models.IntegerField()
    population_2019 = models.IntegerField()
