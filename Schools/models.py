from django.db import models
from Core.models import Location


class School(Location):
    BOYS = 'B'
    GIRLS = 'G'
    MIXED = 'M'

    GENDER_CHOICES = (
        (BOYS, 'Boys'),
        (GIRLS, 'Girls'),
        (MIXED, 'Mixed'),
    )

    urn = models.IntegerField()
    other_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    is_new = models.BooleanField(default=False)
    is_primary = models.BooleanField(default=False)
    is_secondary = models.BooleanField(default=False)
    is_post16 = models.BooleanField(default=False)
    age_from = models.IntegerField()
    age_to = models.IntegerField()
    gender = models.CharField(max_length=2,
                              choices=GENDER_CHOICES,
                              default=MIXED)
    sixth_form_gender = models.CharField(max_length=2,
                                         choices=GENDER_CHOICES,
                                         default=MIXED)

    def __str__(self):
        return self.name
