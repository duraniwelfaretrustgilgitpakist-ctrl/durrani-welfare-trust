'use client';
import { useEffect, useState } from 'react';
import { Award, Shield, Star, Trophy } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';

interface AwardItem {
  id: number;
  title: string;
  organization: string;
  year: string;
  description: string;
  image: string | null;
  image_url: string;
}

const GRADIENTS = [
  '#166534',
  '#6b21a8',
  '#1e40af',
  '#0f3d22',
];
const ICONS = [Shield, Star, Award, Trophy];

function resolveImage(item: AwardItem): string | null {
  if (item.image_url) return item.image_url;
  if (item.image) {
    return item.image.startsWith('http') ? item.image : mediaUrl(item.image);
  }
  return null;
}

export default function AwardsSection() {
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getAwards()
      .then((res) => {
        const data = res.data.results ?? res.data;
        if (data.length > 0) setAwards(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <Award size={14} /> Recognition & Awards
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-3">
            Nationally & Globally Recognised
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Durrani Welfare Trust's work has earned recognition from the Pakistan Army,
            international women's organisations, and UN agencies.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-soft animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {awards.map((award, i) => {
              const Icon = ICONS[i % ICONS.length];
              const bgColor = GRADIENTS[i % GRADIENTS.length];
              const imgSrc = resolveImage(award);
              return (
                <div key={award.id} className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-shadow">
                  {/* Image or fallback icon block */}
                  <div className="relative h-52 overflow-hidden">
                    {imgSrc ? (
                      <>
                        <img
                          src={imgSrc}
                          alt={award.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        {/* Subtle bottom overlay for org/year tag only */}
                        <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
                          <span className="text-xs font-bold text-white">
                            {award.organization}{award.organization && award.year ? ' · ' : ''}{award.year}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: bgColor }}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                          <Icon size={32} color="white" />
                        </div>
                        <span className="text-xs font-bold text-white px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                          {award.organization}{award.organization && award.year ? ' · ' : ''}{award.year}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading font-bold text-lg mb-2">{award.title}</h3>
                    {!imgSrc && award.organization && (
                      <p className="text-xs font-semibold text-dwt-600 mb-2">{award.organization} · {award.year}</p>
                    )}
                    {award.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">{award.description}</p>
                    )}
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
