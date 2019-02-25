from rest_framework import serializers
from ActivePlaces.models import ActivePlace, Facility, Disability, OpeningTimes


class OpeningTimesSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpeningTimes
        fields = '__all__'


class FacilitySerializer(serializers.ModelSerializer):
    openingtimes_set = OpeningTimesSerializer(many=True)

    class Meta:
        model = Facility
        fields = '__all__'


class DisabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Disability
        fields = '__all__'


class ActivePlaceSerializer(serializers.ModelSerializer):
    facility_set = FacilitySerializer(many=True)
    disability = DisabilitySerializer(many=False)

    class Meta:
        model = ActivePlace
        fields = '__all__'
