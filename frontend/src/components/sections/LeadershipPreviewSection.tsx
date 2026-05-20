'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Shield } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';
import { resolveTeamPhoto } from '@/lib/teamPhotos';

interface Leader {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  badges: string[];
}

export default function LeadershipPreviewSection() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getTeamMembers({ category: 'leadership' })
      .then((res) => {
        const data = res.data.results ?? res.data;
        if (data.length > 0) setLeaders(data.slice(0, 2));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <Award size={14} /> Leadership
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">Meet Our Leadership</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Visionary leaders guiding the Trust toward greater impact, accountability, and service.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          {loading ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-soft animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            ))
          ) : (
            leaders.map((l) => {
              const initials = l.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
              const photoSrc = resolveTeamPhoto(l.name, l.role, l.photo, mediaUrl);
              return (
                <div key={l.id} className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 group">
                  <div className="relative bg-gradient-to-br from-dwt-700 to-dwt-500 py-10 flex flex-col items-center">
                    {photoSrc ? (
                      <img src={photoSrc} alt={l.name} loading="lazy" className="w-28 h-28 rounded-full object-cover object-center shadow-card border-4 border-white/90" />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-white/95 text-dwt-700 flex items-center justify-center font-heading font-bold text-3xl shadow-card">
                        {initials}
                      </div>
                    )}
                    {l.badges && l.badges.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mt-3 px-4">
                        {l.badges.map((b) => (
                          <span key={b} className="text-xs bg-white/20 border border-white/30 text-white px-2 py-0.5 rounded-full font-semibold">
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-heading font-bold text-xl mb-1">{l.name}</h3>
                    <p className="text-dwt-600 text-sm font-semibold mb-3">{l.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{l.bio}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/about/team" className="inline-flex items-center gap-2 px-6 py-3 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all">
            View Full Team <ArrowRight size={16} />
          </Link>
          <Link href="/about/founder-message" className="inline-flex items-center gap-2 px-6 py-3 border border-dwt-200 text-dwt-600 font-semibold rounded-lg hover:bg-dwt-50 transition-all">
            <Shield size={16} /> Founder's Message
          </Link>
        </div>
      </div>
    </section>
  );
}
