from CQC.models import CQCLocation


def get_closest_health_services(request, lat, lng):
    dentists = CQCLocation.objects.filter(location_type__icontains="dentist")
    gps = CQCLocation.objects.filter(location_type__icontains="GP")
    hospital = CQCLocation.objects.filter(location_type__icontains="hospital")
