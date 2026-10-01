from django.contrib import admin
from django.urls import path, include

# Importaciones para servir archivos estáticos y de medios en DESARROLLO
from django.conf import settings
from django.conf.urls.static import static

from accounts import views as accounts_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', accounts_views.login_view, name='login'),
    path('register/', accounts_views.register_view, name='register'),
    path('logout/', accounts_views.logout_view, name='logout'),
    path('', include('home.urls')),
]


if settings.DEBUG:
    # Añade las URLs para los archivos de medios (subidas de usuarios)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)