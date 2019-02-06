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
    religion = models.CharField(max_length=100, null=True)
    selective = models.BooleanField(null=True)

    def __str__(self):
        return self.name


class OfstedInspection(models.Model):
    OUTSTANDING = 1
    GOOD = 2
    REQUIRES_IMPROVEMENT = 3
    INADEQUATE = 4

    OVERALL_EFFECTIVENESS_CHOICES = (
        (OUTSTANDING, 'Outstanding'),
        (GOOD, 'Good'),
        (REQUIRES_IMPROVEMENT, 'Requires Improvement'),
        (INADEQUATE, 'Inadequate'),
    )

    school = models.ForeignKey(School, on_delete=models.CASCADE)
    inspection_date = models.DateTimeField(null=True)
    publication_date = models.DateTimeField(null=True)
    overall_effectiveness = models.IntegerField(choices=OVERALL_EFFECTIVENESS_CHOICES)

    def __str__(self):
        return "%s %s" % (self.school.name, self.overall_effectiveness)

    @property
    def link(self):
        return "http://www.ofsted.gov.uk/oxedu_providers/full/%s/" % self.school.urn

    def get_overall_effectiveness(self):
        return [i for i in self.OVERALL_EFFECTIVENESS_CHOICES if i[0] == self.overall_effectiveness][0][1]