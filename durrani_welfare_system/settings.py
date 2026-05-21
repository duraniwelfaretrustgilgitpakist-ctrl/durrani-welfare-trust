"""
Django settings for Durrani Welfare Trust Management System.
"""
import os
import sys
from datetime import timedelta
from pathlib import Path

FROZEN = getattr(sys, 'frozen', False)

if FROZEN:
    EXE_DIR = Path(sys.executable).resolve().parent
    INTERNAL_DIR = EXE_DIR / '_internal'
    BASE_DIR = INTERNAL_DIR
    DATA_DIR = Path(os.environ.get('LOCALAPPDATA', os.path.expanduser('~'))) / 'DWT Management System'
    DATA_DIR.mkdir(parents=True, exist_ok=True)
else:
    BASE_DIR = Path(__file__).resolve().parent.parent
    EXE_DIR = BASE_DIR
    INTERNAL_DIR = BASE_DIR
    DATA_DIR = BASE_DIR

SECRET_KEY = os.environ.get('DWT_SECRET_KEY', 'django-insecure-change-this-in-production-dwt-2024-secret-key')

ON_VERCEL_EARLY = bool(os.environ.get('VERCEL', '') or os.environ.get('VERCEL_ENV', ''))
DEBUG = os.environ.get('DWT_DEBUG', '1') == '1'

ALLOWED_HOSTS = ['*']

CSRF_TRUSTED_ORIGINS = [
    'https://dwt-backend.vercel.app',
    'https://*.vercel.app',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    # DWT apps
    'durrani_welfare_system.core',
    'durrani_welfare_system.students',
    'durrani_welfare_system.staff',
    'durrani_welfare_system.ambulance',
    'durrani_welfare_system.projects',
    'durrani_welfare_system.accounts',
    'durrani_welfare_system.reports',
    'durrani_welfare_system.volunteers',
    'durrani_welfare_system.drivers',
    'durrani_welfare_system.daily_expenses',
    'durrani_welfare_system.salaries',
    'durrani_welfare_system.cms',
    'durrani_welfare_system.api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'durrani_welfare_system.middleware.AdminCsrfMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'durrani_welfare_system.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [str(INTERNAL_DIR / 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'durrani_welfare_system.core.context_processors.global_context',
            ],
        },
    },
]

WSGI_APPLICATION = 'durrani_welfare_system.wsgi.application'

# Database — priority:
#   1. DATABASE_URL (production Postgres: Neon/Vercel/Render)
#   2. Vercel serverless without DB → ephemeral SQLite in /tmp
#   3. Local development → SQLite in DATA_DIR
DATABASE_URL = os.environ.get('DATABASE_URL', '').strip()
ON_VERCEL = ON_VERCEL_EARLY

if DATABASE_URL:
    try:
        import dj_database_url
        # conn_max_age=0: no connection reuse — required for serverless (Vercel/Neon)
        DATABASES = {'default': dj_database_url.parse(DATABASE_URL, conn_max_age=0, ssl_require=True)}
        DATABASES['default'].setdefault('OPTIONS', {})
        DATABASES['default']['OPTIONS']['sslmode'] = 'require'
    except ImportError:
        import re
        m = re.match(r'postgres(?:ql)?://(?P<user>[^:]+):(?P<pwd>[^@]+)@(?P<host>[^:/]+)(?::(?P<port>\d+))?/(?P<name>[^?]+)', DATABASE_URL)
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': m.group('name'),
                'USER': m.group('user'),
                'PASSWORD': m.group('pwd'),
                'HOST': m.group('host'),
                'PORT': m.group('port') or '5432',
                'OPTIONS': {'sslmode': 'require'},
            }
        }
elif ON_VERCEL:
    # Ephemeral SQLite for Vercel testing (data lost on cold start)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': '/tmp/dwt_db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': DATA_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Karachi'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATICFILES_DIRS = [str(INTERNAL_DIR / 'static')]
STATIC_ROOT = str(EXE_DIR / 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = '/tmp/media' if ON_VERCEL else str(DATA_DIR / 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/login/'

AUTH_USER_MODEL = 'core.User'

BACKUP_DIR = DATA_DIR / 'backups'

# ============================================================
# Django REST Framework
# ============================================================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=12),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ============================================================
# CORS - allow all origins (public NGO website)
# ============================================================
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
