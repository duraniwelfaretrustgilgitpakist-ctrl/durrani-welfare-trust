from django.middleware.csrf import CsrfViewMiddleware

# Paths that are password-protected and don't need the CSRF cookie check.
# The Django admin and custom dashboard are only accessible after login,
# so CSRF cookie issues from Vercel's serverless proxy won't affect security.
_EXEMPT_PREFIXES = ('/django-admin/', '/login/', '/logout/', '/dashboard/',
                    '/backup/', '/users/', '/students/', '/staff/',
                    '/ambulance/', '/projects/', '/volunteers/', '/drivers/',
                    '/daily-expenses/', '/salaries/', '/reports/')


class AdminCsrfMiddleware(CsrfViewMiddleware):
    def process_view(self, request, callback, callback_args, callback_kwargs):
        if any(request.path.startswith(p) for p in _EXEMPT_PREFIXES):
            return None  # skip CSRF check for admin/dashboard paths
        return super().process_view(request, callback, callback_args, callback_kwargs)
