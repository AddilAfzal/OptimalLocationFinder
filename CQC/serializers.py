from rest_framework import serializers

from CQC.models import CQCLocation


class CQCLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CQCLocation
        fields = ('name', 'town', 'lat', 'lng', 'cqc_id', 'last_inspection_date', 'last_rating')
