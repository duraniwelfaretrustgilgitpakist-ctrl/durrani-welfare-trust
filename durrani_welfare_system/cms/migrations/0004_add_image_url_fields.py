from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0003_add_founder_ceo_message_sections'),
    ]

    operations = [
        migrations.AlterField(
            model_name='herobanner',
            name='background_image',
            field=models.ImageField(blank=True, upload_to='cms/hero/'),
        ),
        migrations.AddField(
            model_name='herobanner',
            name='image_url',
            field=models.URLField(blank=True, help_text='Paste an external image URL (e.g. from Cloudinary or Imgur). Use this instead of file upload for reliable hosting.'),
        ),
        migrations.AddField(
            model_name='award',
            name='image_url',
            field=models.URLField(blank=True, help_text='Paste an external image URL for the award photo or certificate.'),
        ),
    ]
