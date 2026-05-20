'use client';
import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';

interface Testimonial {
  id: number;
  name: string;
  quote: string;
  role: string;
  photo: string | null;
}

const COLORS = [
  'bg-rose-100 text-rose-600',
  'bg-dwt-100 text-dwt-700',
  'bg-blue-100 text-blue-700',
  'bg-amber-100 text-amber-700',
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getTestimonials()
      .then((res) => {
        const data = res.data.results ?? res.data;
        if (data.length > 0) setTestimonials(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding text-white" style={{ backgroundColor: '#0f3d22' }}>
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-200 font-bold text-sm uppercase tracking-wider">Stories of Impact</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4 text-white">Lives Transformed</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Real stories from the families and individuals whose lives have been changed
            by the generosity of our donors and the dedication of our team.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl p-6 animate-pulse" style={{ backgroundColor: '#114a29' }}>
                <div className="h-8 w-8 rounded mb-4" style={{ backgroundColor: '#155a32' }} />
                <div className="space-y-2 mb-6">
                  <div className="h-3 rounded w-full" style={{ backgroundColor: '#155a32' }} />
                  <div className="h-3 rounded w-5/6" style={{ backgroundColor: '#155a32' }} />
                  <div className="h-3 rounded w-4/6" style={{ backgroundColor: '#155a32' }} />
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-dwt-600">
                  <div className="w-12 h-12 rounded-full" style={{ backgroundColor: '#155a32' }} />
                  <div className="space-y-1.5">
                    <div className="h-3 bg-white/20 rounded w-24" />
                    <div className="h-2.5 bg-white/10 rounded w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => {
              const initials = t.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
              const color = COLORS[i % COLORS.length];
              return (
                <div key={t.id} className="rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300" style={{ backgroundColor: '#114a29' }}>
                  <Quote className="text-dwt-300 mb-4" size={32} />
                  <p className="text-gray-200 leading-relaxed mb-6 italic text-sm">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-dwt-600">
                    {t.photo ? (
                      <img src={mediaUrl(t.photo)} alt={t.name} loading="lazy" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center font-heading font-bold flex-shrink-0`}>
                        {initials}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-sm text-white">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
