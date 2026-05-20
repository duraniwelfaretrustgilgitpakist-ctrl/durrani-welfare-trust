'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Home, Baby, GraduationCap, Truck, Users, Droplets, Heart,
  Gift, TreePine, Mic, HandHeart, HelpCircle, ArrowLeft,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';
import { publicApi } from '@/lib/api';

interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon: string;
  is_featured: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  home: Home, baby: Baby, 'graduation-cap': GraduationCap, ambulance: Truck,
  users: Users, droplets: Droplets, heart: Heart, gift: Gift,
  tree: TreePine, 'tree-pine': TreePine, mic: Mic, volunteer: HandHeart,
};

const PROGRAM_IMAGES: Record<string, string> = {
  'orphanage-for-girls':        '/gallery/orphanage-girls.jpeg',
  'infant-care-adoption':       '/gallery/infant-care.jpeg',
  'education-programmes':       '/gallery/madrasa-building.jpeg',
  'ambulance-services':         '/gallery/ambulance-fleet.jpeg',
  'women-empowerment':          '/images/rawisa hub.jpeg',
  'clean-water-infrastructure': '/images/water.jpeg',
  'food-distribution':          '/images/qurbnai (2).jpeg',
  'marriage-support':           '/images/marrigaes.jpeg',
  'seminars-youth-empowerment': '/youth led civic epowerement.jpeg',
};

const PROGRAM_GALLERY: Record<string, string[]> = {
  'food-distribution': [
    '/images/qurbnai (2).jpeg',
    '/images/qurbani (2).jpeg',
    '/images/qurbnai.jpeg',
    '/images/qurbani (3).jpeg',
  ],
  'marriage-support': ['/images/marrigaes.jpeg'],
  'women-empowerment': ['/images/rawisa hub.jpeg', '/gallery/women-training.jpeg'],
  'clean-water-infrastructure': ['/images/water.jpeg'],
};

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    publicApi
      .getServiceBySlug(slug)
      .then((res) => setService(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="section-padding container-page max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (notFound || !service) {
    return (
      <PublicLayout>
        <div className="section-padding container-page max-w-4xl text-center">
          <h1 className="font-heading font-bold text-3xl mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">This service could not be found.</p>
          <Link href="/services" className="btn-primary">View All Services</Link>
        </div>
      </PublicLayout>
    );
  }

  const Icon = ICON_MAP[service.icon] ?? HelpCircle;
  const mainImage = PROGRAM_IMAGES[service.slug];
  const gallery = PROGRAM_GALLERY[service.slug] ?? (mainImage ? [mainImage] : []);

  return (
    <PublicLayout>
      <PageHeader
        title={service.title}
        subtitle={service.short_description}
        breadcrumb={service.title}
        image={mainImage}
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-4xl">
          <Link href="/services" className="inline-flex items-center gap-2 text-dwt-500 font-semibold hover:text-dwt-700 mb-8">
            <ArrowLeft size={16} /> Back to All Services
          </Link>

          <div className="flex items-start gap-6 mb-10">
            <div className="w-20 h-20 rounded-2xl bg-dwt-50 flex items-center justify-center text-dwt-500 flex-shrink-0">
              <Icon size={40} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-3xl mb-2">{service.title}</h2>
              {service.is_featured && (
                <span className="inline-block px-3 py-1 bg-dwt-50 text-dwt-600 text-xs font-semibold rounded-full border border-dwt-200">
                  Featured Programme
                </span>
              )}
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            {(service.full_description || service.short_description)
              .split('\n\n')
              .filter(Boolean)
              .map((para, i) => (
                <p key={i} className="text-gray-600 leading-relaxed text-lg mt-4">
                  {para}
                </p>
              ))}
          </div>

          {/* Photo gallery */}
          {gallery.length > 0 && (
            <div className={`mt-10 grid gap-4 ${gallery.length === 1 ? 'grid-cols-1' : gallery.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-2'}`}>
              {gallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${service.title} — photo ${i + 1}`}
                  loading="lazy"
                  className="w-full rounded-2xl object-cover shadow-soft"
                  style={{ maxHeight: gallery.length === 1 ? '420px' : '280px' }}
                />
              ))}
            </div>
          )}

          <div className="mt-12 bg-gradient-to-r from-dwt-700 to-dwt-500 text-white rounded-2xl p-8 text-center">
            <h3 className="font-heading font-bold text-2xl mb-3">Get Involved</h3>
            <p className="text-gray-100 mb-6">
              Support this programme or get in touch:{' '}
              <a href="tel:03129700108" className="font-bold underline">03129700108</a>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/donate" className="px-6 py-3 bg-white text-dwt-800 font-bold rounded-lg hover:bg-dwt-50 transition-all">
                Donate Now
              </Link>
              <Link href="/volunteer" className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all">
                Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
