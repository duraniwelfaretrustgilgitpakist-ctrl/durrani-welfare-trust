'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, Award, Shield, Star, Heart } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';
import { publicApi, mediaUrl } from '@/lib/api';
import { resolveTeamPhoto } from '@/lib/teamPhotos';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  category: string;
  bio: string;
  photo: string | null;
  email?: string;
  phone?: string;
  badges?: string[];
}


function PersonCard({ p }: { p: TeamMember }) {
  const photoSrc = resolveTeamPhoto(p.name, p.photo, mediaUrl);

  return (
    <div className="bg-white rounded-2xl shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-dwt-700 to-dwt-500 pt-8 pb-6 px-4 text-center flex-shrink-0">
        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white/90 shadow-card bg-white/20">
          {photoSrc ? (
            <img src={photoSrc} alt={p.name} loading="lazy" className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-heading font-bold text-2xl text-white">
              {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
          )}
        </div>
        {p.badges && p.badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {p.badges.map((b) => (
              <span key={b} className="text-xs bg-white/20 border border-white/30 text-white px-2 py-0.5 rounded-full leading-tight">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-5 text-center flex flex-col flex-1">
        <h3 className="font-heading font-bold text-lg leading-snug mb-1">{p.name}</h3>
        <p className="text-dwt-600 font-semibold text-sm mb-3">{p.role}</p>
        <p className="text-sm text-gray-600 leading-relaxed flex-1">{p.bio}</p>
        {(p.email || p.phone) && (
          <div className="flex justify-center gap-2 mt-4 pt-3 border-t border-gray-100">
            {p.email && (
              <a href={`mailto:${p.email}`} className="w-8 h-8 rounded-full bg-dwt-50 text-dwt-600 hover:bg-dwt-500 hover:text-white flex items-center justify-center transition-all">
                <Mail size={14} />
              </a>
            )}
            {p.phone && (
              <a href={`tel:${p.phone}`} className="w-8 h-8 rounded-full bg-dwt-50 text-dwt-600 hover:bg-dwt-500 hover:text-white flex items-center justify-center transition-all">
                <Phone size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [leadership, setLeadership] = useState<TeamMember[]>([]);
  const [coreTeam, setCoreTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    publicApi.getTeamMembers({ category: 'leadership' })
      .then((r) => { const d = r.data.results || r.data; if (d.length > 0) setLeadership(d); })
      .catch(() => {});
    publicApi.getTeamMembers({ category: 'core' })
      .then((r) => { const d = r.data.results || r.data; if (d.length > 0) setCoreTeam(d); })
      .catch(() => {});
  }, []);

  return (
    <PublicLayout>
      <PageHeader
        title="Leadership & Team"
        subtitle="Meet the dedicated people guiding Durrani Welfare Trust's mission of service"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Our Team' }]}
        image="/gallery/girls-certificates.jpeg"
      />

      {/* Leadership */}
      <section className="section-padding bg-white">
        <div className="container-page max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
              <Award size={16} /> Active Leadership
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">Our Leadership</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              The women and men leading Durrani Welfare Trust forward — with compassion, integrity, and relentless commitment to those we serve.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {leadership.map((p) => <PersonCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Pride of Pakistan Award Section */}
      <section className="section-padding bg-dwt-800 text-white">
        <div className="container-page max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold mb-5">
                <Shield size={16} className="text-dwt-200" /> National Recognition
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 leading-snug">
                ISPR Pride of Pakistan Award
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                On the occasion of Pakistan's 78th Independence Day (Operation Marka-e-Haq),
                Ms. Aman Faraz Durrani was honoured with the prestigious <strong className="text-white">ISPR Pride of Pakistan Award</strong> for
                outstanding service to orphan girls and underprivileged families in Gilgit-Baltistan.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                This recognition by the Inter Services Public Relations reflects the Trust's commitment
                to welfare work that touches the lives of thousands across the region.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: 'ISPR', sub: 'Pride of Pakistan 2025' },
                  { icon: Star,   label: 'EVE Vision', sub: 'International Award 2026' },
                  { icon: Award,  label: 'UNICEF', sub: 'Safe Families Certified' },
                ].map((a) => {
                  const Icon = a.icon;
                  return (
                    <div key={a.label} className="bg-white/10 border border-white/10 rounded-xl p-3 text-center">
                      <Icon size={18} className="text-dwt-200 mx-auto mb-1.5" />
                      <div className="text-xs font-bold text-white">{a.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5 leading-tight">{a.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <img
                src="/team/pride-of-pakistan-award.jpeg"
                alt="ISPR Pride of Pakistan Award - Aman Faraz Durrani"
                className="rounded-2xl shadow-card w-full object-cover max-h-80"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-dwt-900/80 backdrop-blur rounded-xl p-3 text-center text-sm">
                <div className="font-semibold text-white">78th Independence Day Ceremony</div>
                <div className="text-dwt-200 text-xs mt-0.5">Operation Marka-e-Haq — August 2025</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Team */}
      <section className="section-padding bg-gray-50">
        <div className="container-page max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
              <Heart size={16} /> Founding & Core Team
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">Core Team</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              The founder whose dream started it all, and the dedicated leaders carrying that dream forward every day.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreTeam.map((p) => <PersonCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-dwt-800 to-dwt-600 text-white">
        <div className="container-page text-center">
          <h2 className="font-heading font-bold text-3xl mb-4">Join Our Mission</h2>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-gray-200">
            We are always looking for passionate individuals who want to make a difference in Gilgit-Baltistan.
            Apply to volunteer or reach out to us directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/volunteer" className="px-6 py-3 bg-white text-dwt-800 font-bold rounded-lg hover:bg-dwt-50 transition-all">
              Become a Volunteer
            </Link>
            <Link href="/contact" className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
