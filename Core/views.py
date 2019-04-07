from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse


def index(request):
    return render(request, 'index.html')


def explore_area(request):
    return render(request, 'explore.html')


def results(request):
    return redirect(reverse('Core:index'))
