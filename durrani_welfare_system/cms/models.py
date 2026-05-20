"""CMS models for managing public website content."""
from django.db import models


class SiteSettings(models.Model):
    """Singleton model for global site settings."""
    organization_name = models.CharField(max_length=200, default='Durrani Welfare Trust')
    tagline = models.CharField(max_length=300, default='Serving Humanity with Compassion')
    logo = models.ImageField(upload_to='cms/site/', blank=True, null=True)
    favicon = models.ImageField(upload_to='cms/site/', blank=True, null=True)

    # Contact details
    email = models.EmailField(blank=True)
    phone_primary = models.CharField(max_length=30, blank=True)
    phone_secondary = models.CharField(max_length=30, blank=True)
    address = models.TextField(blank=True)
    google_maps_embed = models.TextField(blank=True, help_text='Google Maps iframe embed URL')

    # Social media
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    # SEO
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=500, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.organization_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)


class HeroBanner(models.Model):
    """Hero/banner section on home page (slideshow)."""
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=400, blank=True)
    description = models.TextField(blank=True)
    background_image = models.ImageField(upload_to='cms/hero/', blank=True)
    image_url = models.URLField(blank=True, help_text='Paste an external image URL (e.g. from Cloudinary or Imgur). Use this instead of file upload for reliable hosting.')
    cta_primary_text = models.CharField(max_length=50, blank=True, default='Donate Now')
    cta_primary_link = models.CharField(max_length=200, blank=True, default='/donate')
    cta_secondary_text = models.CharField(max_length=50, blank=True, default='Volunteer')
    cta_secondary_link = models.CharField(max_length=200, blank=True, default='/volunteer')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Hero Banner'

    def __str__(self):
        return self.title


class AboutSection(models.Model):
    """About / Mission / Vision content."""
    SECTION_CHOICES = [
        ('about', 'About Us'),
        ('mission', 'Our Mission'),
        ('vision', 'Our Vision'),
        ('values', 'Core Values'),
        ('history', 'Our History'),
        ('founder_message', "Founder's Message"),
        ('ceo_message', "CEO's Message"),
    ]
    section = models.CharField(max_length=20, choices=SECTION_CHOICES, unique=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='cms/about/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'About Section'

    def __str__(self):
        return f'{self.get_section_display()}: {self.title}'


class Service(models.Model):
    """Services / Programs offered by the NGO."""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    short_description = models.CharField(max_length=400)
    full_description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text='Icon class or emoji (e.g. heart, book)')
    image = models.ImageField(upload_to='cms/services/', blank=True, null=True)
    image_url = models.CharField(max_length=500, blank=True, help_text='Static image path or external URL (e.g. /gallery/orphanage-girls.jpeg)')
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


class NewsPost(models.Model):
    """News, announcements, and blog posts."""
    CATEGORY_CHOICES = [
        ('news', 'News'),
        ('announcement', 'Announcement'),
        ('event', 'Event'),
        ('campaign', 'Campaign'),
        ('story', 'Story'),
    ]
    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=320, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='news')
    summary = models.CharField(max_length=500)
    content = models.TextField()
    cover_image = models.ImageField(upload_to='cms/news/', blank=True, null=True)
    author = models.CharField(max_length=100, blank=True, default='DWT Team')
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at']
        verbose_name = 'News Post'

    def __str__(self):
        return self.title


class GalleryAlbum(models.Model):
    """Photo album / gallery category."""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='cms/gallery/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Gallery Album'

    def __str__(self):
        return self.title


class GalleryImage(models.Model):
    """Individual photos in an album."""
    album = models.ForeignKey(GalleryAlbum, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='cms/gallery/photos/')
    caption = models.CharField(max_length=300, blank=True)
    order = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-uploaded_at']

    def __str__(self):
        return f'{self.album.title} - {self.caption or self.id}'


class DonationCampaign(models.Model):
    """Active donation campaigns shown on website."""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='cms/campaigns/', blank=True, null=True)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    raised_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    end_date = models.DateField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']

    @property
    def progress_percent(self):
        if self.target_amount > 0:
            return min(100, float(self.raised_amount / self.target_amount * 100))
        return 0

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    """Submissions from the public contact form."""
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    subject = models.CharField(max_length=300)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    is_replied = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f'{self.name} - {self.subject}'


class NewsletterSubscriber(models.Model):
    """Newsletter email subscriptions."""
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email


class StudentApplication(models.Model):
    """Public student enrollment / scholarship applications."""
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('enrolled', 'Enrolled'),
    ]
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    # Student details
    full_name = models.CharField(max_length=200)
    father_name = models.CharField(max_length=200)
    cnic_or_bform = models.CharField(max_length=20, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_birth = models.DateField()
    grade = models.CharField(max_length=50, blank=True, help_text='Class/Grade')
    school_name = models.CharField(max_length=200, blank=True)
    previous_education = models.CharField(max_length=200, blank=True)
    address = models.TextField()
    district = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    profile_photo = models.ImageField(upload_to='cms/applications/students/', blank=True, null=True)

    # Contact details
    parent_phone = models.CharField(max_length=30)
    whatsapp_number = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)

    # Additional details
    financial_status = models.CharField(max_length=200, blank=True)
    scholarship_required = models.BooleanField(default=False)
    reason_for_support = models.TextField(blank=True)
    documents = models.FileField(upload_to='cms/applications/documents/', blank=True, null=True)
    notes = models.TextField(blank=True)

    # Workflow
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    review_notes = models.TextField(blank=True)
    linked_student_id = models.PositiveIntegerField(blank=True, null=True, help_text='ID in students table after approval')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'Student Application'

    def __str__(self):
        return f'{self.full_name} ({self.get_status_display()})'


class VolunteerApplication(models.Model):
    """Public volunteer registration applications."""
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    full_name = models.CharField(max_length=200)
    cnic = models.CharField(max_length=20, blank=True)
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    skills = models.TextField(blank=True, help_text='Skills or areas of interest')
    availability = models.CharField(max_length=50, blank=True, help_text='Full time, part time, weekends, etc.')
    profile_photo = models.ImageField(upload_to='cms/applications/volunteers/', blank=True, null=True)

    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    review_notes = models.TextField(blank=True)
    linked_volunteer_id = models.PositiveIntegerField(blank=True, null=True, help_text='ID in volunteers table after approval')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'Volunteer Application'

    def __str__(self):
        return f'{self.full_name} ({self.get_status_display()})'


class TeamMember(models.Model):
    """Team members shown on the public website."""
    CATEGORY_CHOICES = [
        ('leadership', 'Leadership'),
        ('core', 'Core Team'),
        ('advisor', 'Advisors'),
    ]
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='core')
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='cms/team/', blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    badges = models.JSONField(default=list, blank=True, help_text='List of badge strings, e.g. ["ISPR Award 2025"]')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Team Member'

    def __str__(self):
        return f'{self.name} ({self.role})'


class Testimonial(models.Model):
    """Testimonials / impact quotes shown on the website."""
    name = models.CharField(max_length=200)
    quote = models.TextField()
    role = models.CharField(max_length=200, blank=True, help_text='e.g. Orphan Girl, Volunteer, Donor')
    photo = models.ImageField(upload_to='cms/testimonials/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f'{self.name}: {self.quote[:60]}'


class Statistic(models.Model):
    """Impact statistics shown on hero / homepage (e.g. 50+ Orphan Girls)."""
    value = models.CharField(max_length=50, help_text='Display value, e.g. "50+" or "3,000+"')
    label = models.CharField(max_length=200, help_text='Short label, e.g. "Orphan Girls in Our Care"')
    icon = models.CharField(max_length=50, blank=True, help_text='Lucide icon name, e.g. "heart"')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Statistic'

    def __str__(self):
        return f'{self.value} — {self.label}'


class Award(models.Model):
    """Awards and recognitions for the organisation."""
    title = models.CharField(max_length=200)
    organization = models.CharField(max_length=200, blank=True)
    year = models.CharField(max_length=10, blank=True, help_text='e.g. 2025')
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='cms/awards/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Paste an external image URL for the award photo or certificate.')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', '-year']

    def __str__(self):
        return f'{self.title} ({self.year})'


class PublicDonation(models.Model):
    """Public-facing donation pledges (before being processed into the accounts module)."""
    PAYMENT_METHOD_CHOICES = [
        ('bank_transfer', 'Bank Transfer'),
        ('cash', 'Cash'),
        ('cheque', 'Cheque'),
        ('online', 'Online Payment'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
    ]
    CATEGORY_CHOICES = [
        ('general', 'General Donation'),
        ('zakat', 'Zakat'),
        ('sadqa', 'Sadqa'),
        ('fitrana', 'Fitrana'),
        ('education', 'Education'),
        ('healthcare', 'Healthcare'),
        ('other', 'Other'),
    ]

    donor_name = models.CharField(max_length=200)
    contact = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='bank_transfer')
    reference_number = models.CharField(max_length=100, blank=True)
    campaign = models.ForeignKey(DonationCampaign, on_delete=models.SET_NULL, blank=True, null=True, related_name='donations')
    notes = models.TextField(blank=True)
    is_anonymous = models.BooleanField(default=False)

    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    linked_donation_id = models.PositiveIntegerField(blank=True, null=True, help_text='ID in accounts.donation table after confirmation')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'Public Donation'

    def __str__(self):
        return f'{self.donor_name} - PKR {self.amount}'
