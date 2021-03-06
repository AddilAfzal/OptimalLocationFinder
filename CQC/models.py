from django.db import models
from Core.models import Location


class CQCLocation(Location):
    cqc_id  = models.CharField(null=True, max_length=20)
    website = models.URLField(null=True)
    location_type = models.CharField(max_length=600)
    last_inspection_date = models.DateField(null=True)
    last_rating = models.CharField(max_length=30, null=True)

    def __str__(self):
        return self.name
