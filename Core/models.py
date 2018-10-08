from django.db import models


class Location(models.Model):
    name = models.CharField(max_length=100)
    postcode = models.CharField(max_length=8)
    street = models.CharField(max_length=100)
    locality = models.CharField(max_length=50, null=True)
    town = models.CharField(max_length=50)

    lng = models.DecimalField(max_digits=9, decimal_places=6)
    lat = models.DecimalField(max_digits=9, decimal_places=6)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name
