import json
from django.http import HttpResponse
from Core.methods import get_closest_location
from CQC.models import CQCLocation
from CQC.serializers import CQCLocationSerializer


def get_closest_health_services(request, latitude, longitude):
    latitude, longitude = float(latitude), float(longitude)

    dentists = CQCLocation.objects.filter(location_type__icontains="dentist").values()
    gps = CQCLocation.objects.filter(location_type__icontains="GP").values()
    hospital = CQCLocation.objects.filter(location_type__icontains="hospital").values()

    distance_den, dentist_index = get_closest_location(latitude, longitude, dentists)
    distance_gp, gp_index = get_closest_location(latitude, longitude, gps)
    distance_hos, hospital_index = get_closest_location(latitude, longitude, hospital)

    response = json.dumps(
        {
            'dentist': {
                **CQCLocationSerializer(dentists[dentist_index]).data,
                'distance': round(distance_den, 3)
            },
            'hospital': {
                **CQCLocationSerializer(hospital[hospital_index]).data,
                'distance': round(distance_hos, 3)
            },
            'gp': {
                **CQCLocationSerializer(gps[gp_index]).data,
                'distance': round(distance_gp, 3)
            }
        }
    )
    return HttpResponse(response, content_type="json")
