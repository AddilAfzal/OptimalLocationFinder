from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return render(request, 'index.html')


def properties_map(request):
    return render(request, 'map.html')
