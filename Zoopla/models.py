from django.db import models

# Create your models here.
from model_utils.models import TimeStampedModel


class ZooplaQuery(TimeStampedModel):
    area = models.CharField(max_length=100)
    listing_status = models.CharField(max_length=10)
    radius = models.FloatField()
    minimum_price = models.FloatField(null=True)
    maximum_price = models.FloatField(null=True)
    # furnished = models. : TODO: Implement
    property_type = models.CharField(max_length=20)
    page = models.IntegerField(default=1)
    number_of_results = models.IntegerField()
    results = models.TextField()


class Property(models.Model):
    zoopla_query = models.ManyToManyField(to=ZooplaQuery)
    listing_id = models.IntegerField(primary_key=True)
    displayable_address = models.CharField(max_length=100)
    num_bathrooms = models.IntegerField()
    num_bedrooms = models.IntegerField()
    num_floors = models.IntegerField()
    num_recepts	= models.IntegerField()
    listing_status = models.CharField(max_length=10) # TODO: to choice
    status = models.CharField(max_length=10) # TODO: to choice
    price = models.FloatField()
    first_published = models.DateTimeField()
    last_published = models.DateTimeField()