from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
    path('', views.inicio_view, name='inicio'),
]