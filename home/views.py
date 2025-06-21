from django.shortcuts import redirect

def inicio_view(request):
    return redirect('home:inicio')