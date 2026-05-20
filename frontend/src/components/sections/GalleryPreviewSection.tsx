'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X, ZoomIn, Images } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';

interface Photo { src: string; alt: string; }

const FALLBACK_PHOTOS: Photo[] = [
  { src: '/gallery/orphanage-girls.jpeg',    alt: 'Orphan Girls at DWT' },
  { src: '/gallery/ambulance-fleet.jpeg',    alt: 'Free Ambulance Service' },
  { src: '/gallery/women-training.jpeg',     alt: 'Women Empowerment Training' },
  { src: '/images/rawisa hub.jpeg',          alt: 'Rawasia Waheed HUB' },
  { src: '/gallery/girls-certificates.jpeg', alt: 'Education Certificates' },
  { src: '/images/marrigaes.jpeg',           alt: 'Marriage Support Programme' },
];

export default function GalleryPreviewSection() {
  const [photos, setPhotos] = useState<Photo[]>(FALLBACK_PHOTOS);
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  useEffect(() => {
    publicApi
      .getGalleryAlbums()
      .then((res) => {
        const albums = res.data.results ?? res.data;
        const collected: Photo[] = [];
        for (const album of albums) {
          if (album.cover_image) {
            collected.push({
              src: album.cover_image.startsWith('http') ? album.cover_image : mediaUrl(album.cover_image),
              alt: album.title,
            });
          }
          for (const img of album.images ?? []) {
            if (img.image) {
              collected.push({ src: img.image.startsWith('http') ? img.image : mediaUrl(img.image), alt: img.caption || album.title });
            }
          }
          if (collected.length >= 6) break;
        }
        if (collected.length > 0) setPhotos(collected.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-page">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <Images size={14} /> Photo Gallery
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-3">Our Work in Pictures</h2>
          <p className="text-gray-500 leading-relaxed">
            A glimpse of the lives we touch across Gilgit-Baltistan.
          </p>
        </div>

        {/* Uniform 3×2 grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {photos.map((photo, i) => (
            <button
              key={photo.src + i}
              onClick={() => setLightbox(photo)}
              className="relative aspect-square overflow-hidden rounded-2xl group cursor-zoom-in focus:outline-none"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-300" />
              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                  <ZoomIn size={20} className="text-white" />
                </div>
              </div>
              {/* Caption slide-up */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                   style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
                <p className="text-white text-xs font-semibold truncate">{photo.alt}</p>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all shadow-soft"
          >
            View Full Gallery <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-full max-h-[88vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-5 text-white/70 text-sm font-medium">{lightbox.alt}</p>
        </div>
      )}
    </section>
  );
}
