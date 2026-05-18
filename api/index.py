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
    """Run migrations and seed on first request of this instance."""
    global _initialized
    if _initialized:
        return
    try:
        from django.core.management import call_command
        from django.db import connections, OperationalError

        # Test connection first
        try:
            connections['default'].cursor()
        except OperationalError as e:
            print(f'DB connection error: {e}')
            return

        # Run migrations (fast when already applied — Django skips)
        call_command('migrate', '--noinput', verbosity=0)

        from django.contrib.auth import get_user_model
        User = get_user_model()

        # Create admin user if missing
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin', password='admin123',
                email='admin@dwtrust.org', first_name='Admin',
                last_name='User', role='admin', phone='0300-1234567',
            )

        # Only seed if the database is empty (fast check on PostgreSQL)
        from durrani_welfare_system.cms.models import SiteSettings
        if not SiteSettings.objects.filter(pk=1).exists():
            call_command('seed_cms_content', verbosity=0)

        _initialized = True
    except Exception as e:
        print(f'Initialization warning: {e}')
        import traceback
        traceback.print_exc()


_initialize()

from durrani_welfare_system.wsgi import application as base_app


def app(environ, start_response):
    _initialize()

    # Fast health/warmup endpoint — returns immediately without full Django routing
    if environ.get('PATH_INFO') == '/api/ping':
        body = b'{"status":"ok"}'
        start_response('200 OK', [
            ('Content-Type', 'application/json'),
            ('Content-Length', str(len(body))),
            ('Access-Control-Allow-Origin', '*'),
        ])
        return [body]

    return base_app(environ, start_response)
