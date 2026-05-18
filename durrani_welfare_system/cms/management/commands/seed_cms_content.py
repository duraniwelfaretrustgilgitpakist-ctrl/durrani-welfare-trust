"""Management command to seed CMS with real Durrani Welfare Trust content."""
from django.core.management.base import BaseCommand

from durrani_welfare_system.cms.models import (
    SiteSettings, HeroBanner, AboutSection, Service,
    NewsPost, DonationCampaign, TeamMember, Testimonial, Statistic, Award,
)


class Command(BaseCommand):
    help = 'Seed CMS with real Durrani Welfare Trust content'

    def handle(self, *args, **options):
        self.stdout.write('Seeding CMS content...\n')
        self._seed_site_settings()
        self._seed_hero_banners()
        self._seed_about_sections()
        self._seed_services()
        self._seed_news()
        self._seed_campaigns()
        self._seed_team()
        self._seed_testimonials()
        self._seed_statistics()
        self._seed_awards()
        self.stdout.write(self.style.SUCCESS('\n=== CMS seeded successfully! ==='))

    def _seed_site_settings(self):
        SiteSettings.objects.update_or_create(pk=1, defaults={
            'organization_name': 'Durrani Welfare Trust',
            'tagline': 'Be-Saharon Ka Sahara — Serving Humanity with Compassion',
            'email': 'duraniwelfaretrust@gmail.com',
            'phone_primary': '03129700108',
            'address': 'Konodas, Gilgit-Baltistan, Pakistan',
            'meta_description': (
                'Durrani Welfare Trust — an NGO providing shelter, education, healthcare, '
                'ambulance services, and community welfare in Gilgit-Baltistan since 2017.'
            ),
        })
        self.stdout.write('  Site settings OK')

    def _seed_hero_banners(self):
        obj, created = HeroBanner.objects.get_or_create(
            order=1,
            defaults={
                'title': 'Be-Saharon Ka Sahara',
                'subtitle': 'Support of the Unsupported',
                'description': (
                    'Sheltering orphan girls, running free ambulance services, empowering women, '
                    'and serving thousands of families across Gilgit-Baltistan since 2017.'
                ),
                'cta_primary_text': 'Donate Now',
                'cta_primary_link': '/donate',
                'cta_secondary_text': 'Volunteer',
                'cta_secondary_link': '/volunteer',
                'background_image': '',
                'is_active': True,
            }
        )
        if not created:
            # Update text fields only, never overwrite an uploaded image
            HeroBanner.objects.filter(order=1).update(
                title='Be-Saharon Ka Sahara',
                subtitle='Support of the Unsupported',
                description=(
                    'Sheltering orphan girls, running free ambulance services, empowering women, '
                    'and serving thousands of families across Gilgit-Baltistan since 2017.'
                ),
                cta_primary_text='Donate Now',
                cta_primary_link='/donate',
                cta_secondary_text='Volunteer',
                cta_secondary_link='/volunteer',
                is_active=True,
            )
        self.stdout.write(f'  {"+" if created else "~"} hero banner')

    def _seed_about_sections(self):
        sections = [
            ('about', 'About Durrani Welfare Trust',
             'Durrani Welfare Trust is a registered NGO founded in 2017 in Konodas, '
             'Gilgit-Baltistan, Pakistan by Mr. Waheed Faraz Durrani, who lost his own parents '
             'at the tender age of four months. From his childhood struggles emerged a lifelong '
             'dream: to ensure that no child grows up without shelter, care, and affection.\n\n'
             'Today, alongside his daughter Aman Faraz Durrani, the Trust shelters over 50 orphan '
             'girls and serves thousands of families across Gilgit-Baltistan, continuing to expand '
             'its mission of humanity and welfare.'),

            ('mission', 'Our Mission',
             'To protect and nurture the most vulnerable — orphaned children, newborns, widows, '
             'and underprivileged families — by providing them with shelter, quality education, '
             'healthcare, ambulance services, and skill development opportunities. We strive to '
             'reduce the financial burden on needy families and promote humanity, dignity, and '
             'community welfare through collective support and compassion.'),

            ('vision', 'Our Vision',
             'A Pakistan where every child grows up with love, security, and the opportunity to '
             'build a bright future — regardless of whether they have parents or not. We envision '
             'a society built on inclusiveness, responsibility, respect, and collaboration, where '
             'no one is left behind.'),

            ('values', 'Our Core Values',
             'Inclusive: We believe in creating a safe and nurturing environment built on '
             'inclusiveness for every child and family we serve.\n\n'
             'Responsible: Our team takes responsibility for guiding children toward a brighter '
             'future, instilling in them confidence and life skills.\n\n'
             'Respectful: We build our environment on respect, dignity, and compassion for every '
             'individual regardless of their background.\n\n'
             'Collaborative: By working hand in hand with our staff, volunteers, and community '
             'partners, we foster a spirit of collaboration that helps us provide the best care, '
             'education, and opportunities for our children.'),

            ('history', 'Our History',
             'The seeds of Durrani Welfare Trust were sown in pain but nurtured with love.\n\n'
             'Mr. Waheed Faraz Durrani lost his parents at the tender age of four months. From his '
             'childhood struggles emerged a lifelong dream: to ensure that no child grows up without '
             'shelter, care, and affection.\n\n'
             'In 2017, his vision became reality when Durrani Welfare Trust was founded in Konodas, '
             'Gilgit-Baltistan. Today, working alongside his daughter Aman Faraz Durrani, the Trust '
             'has grown to serve thousands of families, earning national and international recognition '
             'including the Pride of Pakistan Award by ISPR 2025 and the International EVE Vision '
             'Award 2026.'),

            ('founder_message', "Founder's Message",
             'Assalamu Alaikum,\n\n'
             'I lost my parents when I was just four months old. I grew up understanding what it '
             'means to have no one. That pain became the purpose of my life — that no child should '
             'ever feel alone, unloved, or forgotten.\n\n'
             '"Every child deserves a home, every family deserves dignity, and every human being '
             'deserves compassion."\n\n'
             'In 2017, with the Grace of Allah and the support of our community, we founded Durrani '
             'Welfare Trust in Konodas, Gilgit-Baltistan. What began as a dream to shelter one '
             'orphan has grown into a movement — serving thousands of families, running free '
             'ambulances, empowering women, and building clean water infrastructure.\n\n'
             'Today, I am proud to work alongside my daughter Aman Faraz Durrani, who carries this '
             'mission forward with equal dedication and passion. Together, we continue to serve '
             'humanity with the belief that small acts of kindness, done consistently, create '
             'lasting change.\n\n'
             'Thank you for being part of this journey.\n\n'
             'Waheed Faraz Durrani\nFounder & Chairman, Durrani Welfare Trust'),

            ('ceo_message', "CEO's Message",
             'Assalamu Alaikum,\n\n'
             'I am Aman Faraz Durrani, and I am proudly working alongside my father, Waheed Faraz '
             'Durrani, carrying forward the mission of Durrani Welfare Trust with dedication and '
             'passion.\n\n'
             '"True success comes from serving humanity with kindness, unity, and compassion."\n\n'
             'My biggest dream is to take my father\'s vision even further — helping needy people, '
             'supporting orphan girls, empowering women, and creating positive change in society. '
             'Through hard work, leadership, and social activism, I am committed to inspiring the '
             'younger generation to work for a better and brighter future.\n\n'
             'Every child who finds shelter at our orphanage, every woman who gains skills at the '
             'Rawasia Waheed HUB, every family reached by our ambulance — they are the reason we '
             'wake up every morning and give our best.\n\n'
             'Thank you for your trust and support.\n\n'
             'Aman Faraz Durrani\nCEO & Trustee, Durrani Welfare Trust'),
        ]
        for section, title, content in sections:
            _, created = AboutSection.objects.update_or_create(
                section=section,
                defaults={'title': title, 'content': content, 'is_active': True}
            )
            self.stdout.write(f'  {"+" if created else "~"} about/{section}')

    def _seed_services(self):
        services = [
            ('Orphanage for Girls', 'orphanage-for-girls', 'home',
             'A safe home for over 50 orphan girls providing shelter, education, healthcare, and the warmth of family.',
             True, 1),
            ('Infant Care & Adoption', 'infant-care-adoption', 'baby',
             'Compassionate care for abandoned newborns and a legal court-registered adoption programme.',
             True, 2),
            ('Education Programmes', 'education-programmes', 'graduation-cap',
             'Holistic early education — Toddler, Pre-School, and primary schooling in a nurturing environment.',
             True, 3),
            ('Free Ambulance Services', 'ambulance-services', 'ambulance',
             '24/7 free emergency ambulance. Over 5,000 patients served at zero cost. Call: 03129700108.',
             True, 4),
            ('Women Empowerment — Rawasia Waheed HUB', 'women-empowerment', 'users',
             'Skills training in sewing and embroidery enabling women to start home-based businesses.',
             True, 5),
            ('Clean Water & Infrastructure', 'clean-water-infrastructure', 'droplets',
             'Construction of water wells in remote Gilgit-Baltistan communities. 5 wells built so far.',
             True, 6),
            ('Food Distribution & Ramadan Programme', 'food-distribution', 'heart',
             'Ramadan rations to 3,000+ families since 2017. Eid clothing for 1,000+ children.',
             False, 7),
            ('Marriage Support for Orphan Girls', 'marriage-support', 'gift',
             'Supporting orphan girls with wedding expenses, Jahez, and clothing for a dignified new beginning.',
             False, 8),
            ('Plantation Drive', 'plantation-drive', 'tree-pine',
             'Community tree plantation drives in Gilgit-Baltistan promoting environmental conservation.',
             False, 9),
            ('Seminars & Youth Empowerment', 'seminars-youth-empowerment', 'mic',
             'Motivational lectures and seminars for youth to encourage welfare and civic engagement.',
             False, 10),
        ]
        for title, slug, icon, desc, featured, order in services:
            _, created = Service.objects.update_or_create(
                slug=slug,
                defaults={
                    'title': title, 'short_description': desc,
                    'full_description': desc, 'icon': icon,
                    'order': order, 'is_featured': featured, 'is_active': True,
                }
            )
            self.stdout.write(f'  {"+" if created else "~"} service/{slug}')

    def _seed_news(self):
        news = [
            ('Aman Faraz Durrani Honoured with Pride of Pakistan Award by ISPR',
             'pride-of-pakistan-award-ispr-2025', 'news',
             'CEO Aman Faraz Durrani received the Pride of Pakistan Award by ISPR during the '
             '78th Independence Day celebrations for outstanding humanitarian work.',
             True),
            ('International EVE Vision Award 2026 — DWT CEO Recognised Globally',
             'eve-vision-award-2026', 'news',
             'Aman Faraz Durrani awarded the International EVE Vision Award 2026 by Vision of '
             'Women & Sahiba Writing Squad for outstanding global achievement.',
             True),
            ('Qurbani Drive — Fresh Meat Distributed to Hundreds of Needy Families',
             'qurbani-drive-eid-ul-adha', 'campaign',
             'This Eid-ul-Adha DWT distributed fresh sacrificial meat to needy families, orphans, '
             'and widows across Gilgit-Baltistan.',
             False),
            ('Ramadan Programme — 3,000+ Families Served Since 2017',
             'ramadan-ration-distribution', 'campaign',
             'Since 2017 Durrani Welfare Trust has distributed Ramadan ration packages to over '
             '3,000 families across Gilgit-Baltistan.',
             False),
            ('New Beginning — DWT Supports Orphan Girls\' Marriages',
             'new-beginning-marriage-support', 'story',
             'Durrani Welfare Trust supports the marriages of orphan girls by providing wedding '
             'expenses, Jahez, and clothing for a dignified new beginning.',
             False),
        ]
        for title, slug, cat, summary, featured in news:
            _, created = NewsPost.objects.update_or_create(
                slug=slug,
                defaults={
                    'title': title, 'category': cat, 'summary': summary,
                    'content': summary, 'author': 'DWT Team',
                    'is_featured': featured, 'is_published': True,
                }
            )
            self.stdout.write(f'  {"+" if created else "~"} news/{slug}')

    def _seed_campaigns(self):
        campaigns = [
            ('Sponsor an Orphan Girl', 'sponsor-an-orphan-girl',
             'Give an orphan girl shelter, education, healthcare, and love. PKR 5,000/month changes a life.',
             '5000000.00', '1250000.00', True),
            ('Build a Water Well — Sadqa Jaria', 'build-water-well-sadqa-jaria',
             'Construct a clean water well for a remote community in Gilgit-Baltistan.',
             '300000.00', '120000.00', True),
            ('Ambulance Fund — Keep the Service Running', 'ambulance-fund',
             'Help maintain and expand our free 24/7 ambulance fleet. Over 5,000 served at no cost.',
             '1500000.00', '450000.00', False),
            ('Ramadan Ration Packages 2025', 'ramadan-rations-2025',
             'Help distribute Ramadan ration packages to deserving families. PKR 5,000 = 1 family package.',
             '1500000.00', '600000.00', False),
        ]
        for title, slug, desc, target, raised, featured in campaigns:
            _, created = DonationCampaign.objects.update_or_create(
                slug=slug,
                defaults={
                    'title': title, 'description': desc,
                    'target_amount': target, 'raised_amount': raised,
                    'is_featured': featured, 'is_active': True,
                }
            )
            self.stdout.write(f'  {"+" if created else "~"} campaign/{slug}')

    def _seed_team(self):
        members = [
            ('Mr. Waheed Faraz Durrani', 'Chairman & Founder', 'leadership',
             'Founded Durrani Welfare Trust in 2017 in Konodas, Gilgit-Baltistan. Having lost his '
             'own parents at four months old, he dedicated his life to ensuring no orphan child '
             'grows up without shelter, care, and education. Today he works alongside his daughter '
             'Aman to continue and expand this mission.',
             [], 1),
            ('Ms. Aman Faraz Durrani', 'CEO & Trustee', 'leadership',
             'Aman Faraz Durrani is proudly working alongside her father, continuing the mission '
             'of humanity, welfare, and community service with dedication and passion. Her biggest '
             'dream is to take her father\'s vision even further — helping needy people, supporting '
             'orphan girls, empowering women, and creating positive change in society.',
             ['ISPR Pride of Pakistan 2025', 'EVE Vision Award 2026'], 2),
            ('Ms. Rawasia Waheed', 'Chairperson', 'leadership',
             'The heart behind Durrani Welfare Trust. Rawasia Waheed has dedicated her life to '
             'the cause of orphan girls and underprivileged families in Gilgit-Baltistan. The '
             'Rawasia Waheed HUB — our women empowerment centre — is named in her honour.',
             [], 3),
        ]
        for name, role, cat, bio, badges, order in members:
            _, created = TeamMember.objects.update_or_create(
                name=name,
                defaults={
                    'role': role, 'category': cat, 'bio': bio,
                    'badges': badges, 'order': order, 'is_active': True,
                }
            )
            self.stdout.write(f'  {"+" if created else "~"} team/{name}')

    def _seed_testimonials(self):
        items = [
            ('Zainab', 'Orphan Girl, Konodas',
             'Before DWT, I had no shelter, no school, no future. Today I study every day and '
             'dream of becoming a doctor. This Trust is my family.', 1),
            ('Nasreen Bibi', 'Women Empowerment Graduate',
             'The Rawasia Waheed HUB gave me skills and confidence. I now run my own small '
             'business and support my children.', 2),
            ('Muhammad Ali', 'Ambulance Patient Family, Hunza',
             'At midnight my father had a heart attack. DWT\'s ambulance reached us in minutes '
             'and saved his life. We had no money — they asked for nothing.', 3),
        ]
        for name, role, quote, order in items:
            _, created = Testimonial.objects.update_or_create(
                name=name,
                defaults={'role': role, 'quote': quote, 'order': order, 'is_active': True}
            )
            self.stdout.write(f'  {"+" if created else "~"} testimonial/{name}')

    def _seed_statistics(self):
        stats = [
            ('50+', 'Orphan Girls in Our Care', 'heart', 1),
            ('3,000+', 'Families Fed Every Ramadan', 'users', 2),
            ('5,000+', 'Ambulance Patients Served', 'ambulance', 3),
            ('200+', 'Women Trained at Rawasia HUB', 'award', 4),
            ('5+', 'Water Wells Built', 'droplets', 5),
            ('9+', 'Years of Dedicated Service', 'star', 6),
        ]
        for value, label, icon, order in stats:
            _, created = Statistic.objects.update_or_create(
                label=label,
                defaults={'value': value, 'icon': icon, 'order': order, 'is_active': True}
            )
            self.stdout.write(f'  {"+" if created else "~"} stat/{label}')

    def _seed_awards(self):
        awards = [
            ('Pride of Pakistan Award by ISPR', 'ISPR',
             '2025',
             'Aman Faraz Durrani received the Pride of Pakistan Award by ISPR during the '
             '78th Independence Day celebrations "Marka-e-Haq" for outstanding humanitarian '
             'service and community welfare.', 1),
            ('International EVE Vision Award', 'Vision of Women & Sahiba Writing Squad',
             '2026',
             'Recognised as an inspiring woman leader with outstanding global achievement in '
             'humanitarian service and women empowerment.', 2),
            ('ISPR Summer Internship 2025', 'Inter Services Public Relations (ISPR)',
             '2025',
             'Aman Faraz Durrani (Durrani Welfare Trust Gilgit) successfully completed the ISPR '
             'Summer Internship Programme 2025 at the Inter Services Public Relations Directorate, '
             'Hilal Road, Rawalpindi — 14 July to 22 August 2025. Signed by Lt. Gen. Ahmed Sharif '
             'Chaudhry, Director General ISPR.', 3),
            ('National Security Workshop Gilgit Baltistan', 'Force Command Northern Areas',
             '2025',
             'Aman Faraz Durrani (CEO Durrani Welfare Trust Gilgit) attended the National Security '
             'Workshop Gilgit Baltistan, 10–14 November 2025, at Headquarters Force Command Northern '
             'Areas, Gilgit. Signed by Major General Syed Imtiaz Hussain Gillani.', 4),
            ('Women Shaping the Future — Distinguished Speaker', 'Vision of Women',
             '2026',
             'Aman Faraz Durrani recognised as a distinguished speaker at the "Women Shaping the '
             'Future" webinar on 8 March 2026, for exceptional expertise, profound knowledge, and '
             'outstanding presentation skills. Certificate presented by Vision of Women.', 5),
            ('Youth-Led Civic Empowerment', 'Future Path',
             '2026',
             'Aman Faraz Durrani actively participated in the "Youth-Led Civic Empowerment" session '
             'on 26 January 2026, organised by Future Path. Certificate signed by '
             'Engr. Anas Khan, Director Future Path.', 6),
            ('UNICEF Safe Families Certification', 'UNICEF & Social Welfare Department',
             '2024',
             'Certified for Safe Children and Safe Families training programmes under the '
             'Rawasia Waheed HUB.', 7),
        ]
        for title, org, year, desc, order in awards:
            _, created = Award.objects.update_or_create(
                title=title,
                defaults={
                    'organization': org, 'year': year,
                    'description': desc, 'order': order, 'is_active': True,
                }
            )
            self.stdout.write(f'  {"+" if created else "~"} award/{title[:40]}')
