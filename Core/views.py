from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return render(request, 'index.html')


def explore_area(request):
    return render(request, 'explore.html')
