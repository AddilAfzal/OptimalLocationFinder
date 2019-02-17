import json

from django.db.models import Sum, Count
from django.http import HttpResponse

from Core.methods import coordinates_to_postcode
from Core.models import Postcode, Demographic


def get_demographics(request, lat, lon):
    postcode = coordinates_to_postcode(lat, lon)
    p = Postcode.objects.get(postal_code=postcode)
    d = Demographic.objects.filter(borough__iexact=p.local_authority_name, age__isnull=False)\
        .exclude(ethnic_group__in=["All persons", "BAME"]).values( 'ethnic_group')\
        .annotate(group=Count("ethnic_group"), total=Sum('population_2019'))

    return HttpResponse(json.dumps(list(d)), content_type="json")
