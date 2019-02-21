import json

from django.db.models import Sum, Count
from django.http import HttpResponse

from Core.methods import coordinates_to_postcode
from Core.models import Postcode, Demographic


def get_demographics(request, lat, lon):
    postcode = coordinates_to_postcode(lat, lon)
    p = Postcode.objects.get(postal_code=postcode)
    print(p, p.local_authority_code)
    d = Demographic.objects.filter(local_authority_code__iexact=p.local_authority_code, age__isnull=False)\
        .exclude(ethnic_group__in=["All persons", "BAME"]).values( 'ethnic_group')\
        .annotate(group=Count("ethnic_group"), total=Sum('population_2019')).order_by('-total')



    return HttpResponse(json.dumps(list(d)), content_type="json")
