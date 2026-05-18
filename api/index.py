"""Vercel Python entry point - serves Django WSGI app."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'durrani_welfare_system.settings')

# Ensure writable media directory exists on Vercel
os.makedirs('/tmp/media', exist_ok=True)

import django
django.setup()

_initialized = False


def _initialize():
    """Run migrations and seed admin + sample CMS content on first request."""
    global _initialized
    if _initialized:
        return
    try:
        from django.core.management import call_command
        from django.db import connections
        connections['default'].cursor()
        call_command('migrate', '--noinput', verbosity=0)

        from django.contrib.auth import get_user_model
        User = get_user_model()
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin', password='admin123',
                email='admin@dwtrust.org', first_name='Admin',
                last_name='User', role='admin', phone='0300-1234567',
            )

        # Seed all CMS content (idempotent — uses update_or_create throughout)
        call_command('seed_cms_content', verbosity=0)

        _initialized = True
    except Exception as e:
        print(f'Initialization warning: {e}')


_initialize()

from durrani_welfare_system.wsgi import application as base_app


def app(environ, start_response):
    _initialize()
    return base_app(environ, start_response)
