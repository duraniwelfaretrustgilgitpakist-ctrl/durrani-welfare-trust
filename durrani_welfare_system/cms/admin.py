"""Django admin for CMS models."""
import functools
from django.contrib import admin
from django.contrib.admin import AdminSite


class DWTAdminSite(AdminSite):
    """Custom admin site — CSRF-exempt for Vercel serverless compatibility."""
    site_header = 'Durrani Welfare Trust'
    site_title = 'DWT Admin'
    index_title = 'Content Management'
    site_url = 'https://durrani-welfare-trust.vercel.app'

    def admin_view(self, view, cacheable=False):
        # Wrap in a plain function so we can set csrf_exempt on it.
        # (Bound methods don't allow attribute assignment, which caused 500s.)
        @functools.wraps(view)
        def exempt_view(*args, **kwargs):
            return view(*args, **kwargs)
        exempt_view.csrf_exempt = True
        return super().admin_view(exempt_view, cacheable)


# Swap the class so all already-registered models keep working
admin.site.__class__ = DWTAdminSite
from .models import (
    SiteSettings, HeroBanner, AboutSection, Service,
    NewsPost, GalleryAlbum, GalleryImage, DonationCampaign,
    ContactMessage, NewsletterSubscriber,
    StudentApplication, VolunteerApplication, PublicDonation,
    TeamMember, Testimonial, Statistic, Award,
)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('organization_name', 'email', 'phone_primary', 'updated_at')


@admin.register(HeroBanner)
class HeroBannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active', 'created_at')
    list_filter = ('is_active',)
    list_editable = ('order', 'is_active')


@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    list_display = ('section', 'title', 'is_active', 'updated_at')
    list_filter = ('section', 'is_active')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_featured', 'is_active')
    list_filter = ('is_featured', 'is_active')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('order', 'is_featured', 'is_active')


@admin.register(NewsPost)
class NewsPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_published', 'is_featured', 'published_at')
    list_filter = ('category', 'is_published', 'is_featured')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}


class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 1


@admin.register(GalleryAlbum)
class GalleryAlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active')
    list_filter = ('is_active',)
    prepopulated_fields = {'slug': ('title',)}
    inlines = [GalleryImageInline]


@admin.register(DonationCampaign)
class DonationCampaignAdmin(admin.ModelAdmin):
    list_display = ('title', 'target_amount', 'raised_amount', 'is_featured', 'is_active')
    list_filter = ('is_featured', 'is_active')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'submitted_at')
    list_filter = ('is_read', 'is_replied')
    search_fields = ('name', 'email', 'subject')
    readonly_fields = ('submitted_at',)


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'subscribed_at')
    list_filter = ('is_active',)


@admin.register(StudentApplication)
class StudentApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'father_name', 'grade', 'status', 'submitted_at')
    list_filter = ('status', 'gender', 'scholarship_required')
    search_fields = ('full_name', 'father_name', 'cnic_or_bform')
    readonly_fields = ('submitted_at', 'updated_at')


@admin.register(VolunteerApplication)
class VolunteerApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'email', 'status', 'submitted_at')
    list_filter = ('status',)
    search_fields = ('full_name', 'phone', 'email')
    readonly_fields = ('submitted_at', 'updated_at')


@admin.register(PublicDonation)
class PublicDonationAdmin(admin.ModelAdmin):
    list_display = ('donor_name', 'amount', 'category', 'status', 'submitted_at')
    list_filter = ('status', 'category', 'payment_method')
    search_fields = ('donor_name', 'email', 'reference_number')
    readonly_fields = ('submitted_at', 'updated_at')


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'category', 'order', 'is_active')
    list_filter = ('category', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('name', 'role')


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('name', 'quote')


@admin.register(Statistic)
class StatisticAdmin(admin.ModelAdmin):
    list_display = ('label', 'value', 'icon', 'order', 'is_active')
    list_editable = ('value', 'order', 'is_active')


@admin.register(Award)
class AwardAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization', 'year', 'order', 'is_active')
    list_filter = ('is_active',)
    list_editable = ('order', 'is_active')
    search_fields = ('title', 'organization')
