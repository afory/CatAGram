from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
    path('inicio/', views.inicio_view, name='inicio'),
]