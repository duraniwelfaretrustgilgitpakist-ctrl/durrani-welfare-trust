'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Users, GraduationCap, Phone, ChevronDown } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';

export default function HeroSection() {
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  useEffect(() => {
    publicApi
      .getHeroBanners()
      .then((res) => {
        const banners = res.data.results ?? res.data;
        const active = banners.find((b: any) => b.is_active) ?? banners[0];
        if (!active) return;
        // Prefer image_url (external, persistent) over uploaded file
        if (active.image_url) {
          setBannerImage(active.image_url);
        } else if (active.background_image) {
          setBannerImage(
            active.background_image.startsWith('http')
              ? active.background_image
              : mediaUrl(active.background_image)
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden flex flex-col" style={{ backgroundColor: '#0f3d22', minHeight: '90vh' }}>

      <div className="container-page relative z-10 flex-1 flex items-center py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center w-full">

          {/* Left: Text content */}
          <div className="text-white order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ backgroundColor: '#114a29', border: '1px solid #1e7a3c' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Serving Gilgit-Baltistan Since 2017
            </div>

            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl leading-[1.05] mb-6">
              <span style={{ color: '#ffffff' }}>Be-Saharon</span><br />
              <span style={{ color: '#ffffff' }}>Ka </span>
              <span style={{ color: '#9cd5b4' }}>Sahara</span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed mb-3 max-w-lg" style={{ color: '#d1fae5' }}>
              Sheltering orphan girls, running free ambulance services, empowering women,
              and serving thousands of families across Gilgit-Baltistan.
            </p>
            <p className="text-sm font-semibold mb-8 italic" style={{ color: '#9cd5b4' }}>
              "The support of the unsupported" — Durrani Welfare Trust
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8">
              <Link href="/donate" className="inline-flex items-center gap-2 px-7 py-4 font-bold rounded-lg shadow-lg transition-all text-base" style={{ backgroundColor: '#ffffff', color: '#0f3d22' }}>
                <Heart size={20} /> Donate Now
              </Link>
              <Link href="/volunteer" className="inline-flex items-center gap-2 px-7 py-4 font-bold rounded-lg transition-all text-base" style={{ border: '2px solid rgba(255,255,255,0.7)', color: '#ffffff' }}>
                <Users size={20} /> Volunteer
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm" style={{ color: '#9cd5b4' }}>
              <a href="tel:03129700108" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={16} /> 03129700108
              </a>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <Link href="/enroll" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <GraduationCap size={16} /> Enroll a Student
              </Link>
            </div>

            {/* Mini stats row */}
            <div className="grid grid-cols-3 gap-3 mt-10">
              {[
                { value: '50+', label: 'Orphan Girls' },
                { value: '5,000+', label: 'Ambulance Trips' },
                { value: '9+', label: 'Years Active' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl px-3 py-4 text-center" style={{ backgroundColor: '#114a29' }}>
                  <div className="font-heading font-bold text-2xl md:text-3xl leading-none" style={{ color: '#9cd5b4' }}>{s.value}</div>
                  <div className="text-xs mt-1 leading-tight" style={{ color: '#6dbf94' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Banner image */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-lg lg:max-w-full">
              {/* Decorative border frame */}
              <div className="absolute -inset-3 rounded-3xl" style={{ border: '2px solid rgba(156,213,180,0.15)' }} />
              <div className="absolute -inset-1.5 rounded-2xl" style={{ border: '1px solid rgba(156,213,180,0.1)' }} />
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="Durrani Welfare Trust — Be-Saharon Ka Sahara"
                  className="relative w-full rounded-2xl object-cover"
                  style={{ aspectRatio: '4/3', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
                />
              ) : (
                <div
                  className="relative w-full rounded-2xl flex flex-col items-center justify-center"
                  style={{ aspectRatio: '4/3', backgroundColor: '#114a29', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
                >
                  <div className="text-6xl mb-3">🕌</div>
                  <div className="font-heading font-bold text-xl" style={{ color: '#9cd5b4' }}>Durrani Welfare Trust</div>
                  <div className="text-sm mt-1" style={{ color: '#6dbf94' }}>Gilgit-Baltistan, Pakistan</div>
                </div>
              )}
              {/* Bottom label badge */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(15,61,34,0.92)', border: '1px solid rgba(156,213,180,0.2)' }}>
                <div className="font-heading font-bold text-sm" style={{ color: '#9cd5b4' }}>Durrani Welfare Trust</div>
                <div className="text-xs" style={{ color: '#6dbf94' }}>Registered NGO · Gilgit-Baltistan</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-6 animate-bounce">
        <ChevronDown size={28} style={{ color: 'rgba(255,255,255,0.3)' }} />
      </div>

      {/* Wave */}
      <svg className="absolute bottom-0 left-0 w-full h-16" viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ fill: '#ffffff' }}>
        <path d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z" />
      </svg>
    </section>
  );
}
