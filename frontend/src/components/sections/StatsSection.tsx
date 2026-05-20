'use client';
import { useEffect, useRef, useState } from 'react';
import { Home, Heart, Truck, Droplets, Users, Baby, Award, Star, GraduationCap, HelpCircle } from 'lucide-react';
import { publicApi } from '@/lib/api';

interface Stat { id: number; value: string; label: string; icon: string; order: number; }

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  home: Home, heart: Heart, truck: Truck, ambulance: Truck,
  droplets: Droplets, users: Users, baby: Baby, award: Award,
  star: Star, graduation: GraduationCap, 'graduation-cap': GraduationCap,
};

const FALLBACK_STATS: Stat[] = [
  { id: 1, value: '50+',    label: 'Orphan Girls in Care',      icon: 'heart',    order: 1 },
  { id: 2, value: '5,000+', label: 'Ambulance Patients Served', icon: 'ambulance', order: 2 },
  { id: 3, value: '3,000+', label: 'Families Fed in Ramadan',   icon: 'users',    order: 3 },
  { id: 4, value: '5+',     label: 'Water Wells Built',         icon: 'droplets', order: 4 },
  { id: 5, value: '200+',   label: 'Women Trained',             icon: 'award',    order: 5 },
  { id: 6, value: '9+',     label: 'Years of Service',          icon: 'star',     order: 6 },
];

function parseNum(val: string): { num: number; suffix: string } {
  const match = val.replace(/,/g, '').match(/^([\d]+)(.*)$/);
  if (!match) return { num: 0, suffix: val };
  return { num: parseInt(match[1]), suffix: match[2] };
}

function formatNum(n: number): string {
  if (n >= 1000) return n.toLocaleString();
  return String(n);
}

function CountUp({ value, active }: { value: string; active: boolean }) {
  const { num, suffix } = parseNum(value);
  const [display, setDisplay] = useState('0' + suffix);

  useEffect(() => {
    if (!active) return;
    if (num === 0) { setDisplay(value); return; }
    const duration = 1200;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * num);
      setDisplay(formatNum(current) + suffix);
      if (step >= steps) { setDisplay(formatNum(num) + suffix); clearInterval(timer); }
    }, interval);
    return () => clearInterval(timer);
  }, [active, num, suffix, value]);

  return <>{display}</>;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>(FALLBACK_STATS);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    publicApi.getStatistics()
      .then((res) => {
        const data = res.data.results ?? res.data;
        if (Array.isArray(data) && data.length > 0) setStats(data.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="w-full py-16" style={{ backgroundColor: '#0f3d22' }}>
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="font-bold text-sm uppercase tracking-widest" style={{ color: '#9cd5b4' }}>Our Impact</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2" style={{ color: '#ffffff' }}>
            Numbers That Tell Our Story
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {stats.map((s, i) => {
            const Icon = ICON_MAP[s.icon] ?? HelpCircle;
            return (
              <div
                key={s.id}
                className="rounded-2xl p-4 md:p-5 text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  backgroundColor: '#114a29',
                  transitionDelay: `${i * 60}ms`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
                }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#155a32' }}>
                  <Icon size={20} style={{ color: '#9cd5b4' }} />
                </div>
                <div className="font-heading font-bold text-2xl md:text-3xl leading-none mb-1" style={{ color: '#c5e6d2' }}>
                  <CountUp value={s.value} active={visible} />
                </div>
                <div className="text-xs font-medium leading-tight" style={{ color: '#7bbf99' }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
