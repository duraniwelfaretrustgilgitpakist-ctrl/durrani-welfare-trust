from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0004_add_image_url_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='image_url',
            field=models.CharField(blank=True, max_length=500, help_text='Static image path or external URL'),
        ),
    ]
