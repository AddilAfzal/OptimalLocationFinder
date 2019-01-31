from django.db import models


class ReverseGeoCodeCache(models.Model):
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    label = models.CharField(max_length=100)

