# coding: utf-8
"""View module."""
from __future__ import unicode_literals

from django.shortcuts import render
from django.conf import settings

from simpleneed.models import Roam, NeedLocation, Stats, SupplyLocation

from time import time


def roamsview(request):
    """Roam view."""
    context = basecontext(request, 'roams')
    context['roams'] = Roam.objects.order_by('-endts')
    context['currentroams'] = Roam.objects.filter(endts__gte=time())
    return render(request, 'roams.html', context=context)


def needlocationsview(request):
    """Need locations view."""
    context = basecontext(request, 'needlocations')
    context['needlocations'] = NeedLocation.objects.order_by('-endts')
    context['currentneedlocations'] = NeedLocation.objects.filter(
        endts__gte=time()
    )
    return render(request, 'needlocations.html', context=context)


def supplylocationsview(request):
    """Supply locations view."""
    context = basecontext(request, 'supplylocations')
    context['supplylocations'] = SupplyLocation.objects.order_by('-endts')
    context['currentsupplylocations'] = SupplyLocation.objects.filter(
        endts__gte=time()
    )
    return render(request, 'supplylocations.html', context=context)


def statsview(request):
    """Need locations view."""
    context = basecontext(request, 'stats', True)
    context['stats'] = Stats.objects.order_by('-endts')
    return render(request, 'stats.html', context=context)


def basecontext(request, page='home', tableofcontents=False):
    """Get base context.

    :rtype: dict
    """
    try:
        sta = Stats.objects.order_by('-ts')[1]

    except (Stats.DoesNotExist, IndexError):
        needs, answeredneeds, roams = 0, 0, 0

    else:
        needs, answeredneeds, roams = sta.needs, sta.answeredneeds, sta.roams

    result = {
        'needs': needs, 'answeredneeds': answeredneeds, 'roams': roams,
        'page': page,
        'tableofcontents': tableofcontents,
        'next': request.GET.get('next', page),
        'host': settings.HOST, 'api': settings.API
    }

    return result


def homeview(request):
    """Home view."""
    context = basecontext(request, 'home')

    return render(request, 'home.html', context=context)


def faqview(request):
    """Faq view."""
    context = basecontext(request, 'faq')
    return render(request, 'faq.html', context=context)


def whyview(request):
    """Why view."""
    context = basecontext(request, 'why', True)
    return render(request, 'why.html', context=context)


def mapview(request):
    """Map view."""
    context = basecontext(request, 'map')
    return render(request, 'map.html', context=context)
