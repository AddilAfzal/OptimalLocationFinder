from django.conf.urls import url, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets

# Serializers define the API representation.
from Schools.models import School, OfstedInspection


class OfstedInspectionSerializer(serializers.ModelSerializer):
    overall_effectiveness = serializers.SerializerMethodField(method_name="serialize_overall_effectiveness")
    # inspection_date = serializers.SerializerMethodField(method_name="serialize_inspection_date")

    def serialize_overall_effectiveness(self, obj):
        return obj.get_overall_effectiveness()

    # def serialize_inspection_date(self, obj):
    #     print(obj)
    #     return obj.inspection_date.date()

    class Meta:
        model = OfstedInspection
        fields = ('overall_effectiveness', 'inspection_date')


class SchoolSerializer(serializers.ModelSerializer):
    distance = serializers.FloatField()
    ofstedinspection_set = OfstedInspectionSerializer(many=True)

    class Meta:
        model = School
        fields = ('name', 'lng', 'lat', 'distance',
                  'is_primary', 'is_secondary', 'is_post16', 'street', 'postcode', 'ofstedinspection_set')

