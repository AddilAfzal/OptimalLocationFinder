from rest_framework import serializers
from ActivePlaces.models import ActivePlace, Facility, Disability, OpeningTimes, Activity, Contacts


class OpeningTimesSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpeningTimes
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
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


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacts
        fields = '__all__'


class ActivePlaceSerializer(serializers.ModelSerializer):
    facility_set = FacilitySerializer(many=True)
    disability = DisabilitySerializer(many=False)
    activities = ActivitySerializer(many=True)
    distance = serializers.FloatField()
    contact = ContactSerializer()

    class Meta:
        model = ActivePlace
        fields = '__all__'
