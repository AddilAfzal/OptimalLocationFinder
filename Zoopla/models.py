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


class Agent(models.Model):
    agent_address = models.CharField(max_length=200)
    agent_logo = models.URLField(null=True)
    agent_name = models.CharField(max_length=200, null=True)
    agent_phone = models.CharField(max_length=20, null=True)


class Property(models.Model):
    zoopla_query = models.ManyToManyField(to=ZooplaQuery)
    listing_id = models.IntegerField(primary_key=True)
    displayable_address = models.CharField(max_length=200)
    num_bathrooms = models.IntegerField()
    num_bedrooms = models.IntegerField()
    num_floors = models.IntegerField()
    num_recepts	= models.IntegerField()
    listing_status = models.CharField(max_length=10) # TODO: to choice
    status = models.CharField(max_length=10) # TODO: to choice
    price = models.FloatField()
    first_published = models.DateTimeField()
    last_published = models.DateTimeField()
    agent = models.ForeignKey(Agent, on_delete=models.DO_NOTHING)
    category = models.CharField(max_length=30)
    county = models.CharField(max_length=30, null=True)
    description = models.TextField(null=True)
    details_url = models.URLField(null=True)
    # floor_area = models.CharField()
    furnished_state = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    outcode = models.CharField(max_length=5)
    post_town = models.CharField(max_length=30, null=True)
    property_type = models.CharField(max_length=20, null=True)
    short_description = models.TextField(null=True)
    street_name = models.CharField(max_length=100, null=True)
    thumbnail_url = models.URLField(null=True)


class RentalPrice(models.Model):
    accurate = models.CharField(max_length=30, null=True)
    per_month = models.FloatField()
    per_week = models.FloatField()
    shared_occupancy = models.CharField(max_length=30) # TODO: Change once values have been established
    zoopla_property = models.ForeignKey(Property, on_delete=models.CASCADE, null=True)


class PriceHistory(models.Model):
    zoopla_property = models.ForeignKey(Property, on_delete=models.CASCADE)
    date_changed = models.DateTimeField()
    direction = models.CharField(max_length=20, null=True)
    percent = models.FloatField()
    price = models.FloatField()


class PropertyImage(models.Model):
    zoopla_property = models.ForeignKey(Property, on_delete=models.CASCADE)
    url = models.URLField()


