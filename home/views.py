from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def inicio_view(request):
    return render(request, 'home/inicio.html')