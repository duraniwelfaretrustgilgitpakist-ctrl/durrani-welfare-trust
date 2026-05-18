"""URL configuration for Durrani Welfare Trust Management System."""
import os
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('django-admin/', admin.site.urls),
    # REST API
    path('api/v1/', include('durrani_welfare_system.api.urls')),
    # Existing Django views (legacy desktop UI)
    path('', include('durrani_welfare_system.core.urls')),
    path('students/', include('durrani_welfare_system.students.urls')),
    path('staff/', include('durrani_welfare_system.staff.urls')),
    path('ambulance/', include('durrani_welfare_system.ambulance.urls')),
    path('projects/', include('durrani_welfare_system.projects.urls')),
    path('accounts/', include('durrani_welfare_system.accounts.urls')),
    path('reports/', include('durrani_welfare_system.reports.urls')),
    path('volunteers/', include('durrani_welfare_system.volunteers.urls')),
    path('drivers/', include('durrani_welfare_system.drivers.urls')),
    path('daily-expenses/', include('durrani_welfare_system.daily_expenses.urls')),
    path('salaries/', include('durrani_welfare_system.salaries.urls')),
]

if settings.DEBUG or bool(os.environ.get('VERCEL', '') or os.environ.get('VERCEL_ENV', '')):
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
