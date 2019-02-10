from django.db import models


class ReverseGeoCodeCache(models.Model):
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    label = models.CharField(max_length=100)


class RouteCache(models.Model):
    start_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    start_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    des_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    des_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    commute_time = models.IntegerField()
    data = models.TextField()
